const assert = require('assert/strict');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userService = require('../../users/user_service');
const recipeService = require('../../recipes/recipe_service');
const { createRecipe, listRecipes, showRecipe, destroyRecipe, updateRecipe } = require('../../recipes/recipe_controller');
const { FakeRes } = require('../test_utils');
const dbHandler = require('../db_utils');

const { JWT_SECRET } = require('../../configs');


describe('Recipe Controller', () => {

    before(async () => await dbHandler.connect());

    afterEach(async () => await dbHandler.clearDatabase());

    after(async () => await dbHandler.closeDatabase());

    describe('#createRecipe', () => {
        it('Without data', async () => {
            const fakeReq = {
                body: {
                    name: null,
                    ingredients: null,
                    preparation: null,
                },
                currentUser: {
                    id: 1
                }
            }
            const fakeRes = new FakeRes()

            await createRecipe(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 400)
            assert.equal(fakeRes.body.message, 'Invalid entries. Try again.')
        })

        it('With Valid data', async () => {
            const { user } = await userService.createUser({
                name: 'Dann Luciano',
                email: 'dannluciano@gmail.com',
                password: '12345678',
                role: 'user'
            })
            const fakeReq = {
                body: {
                    name: 'Banana',
                    ingredients: 'lorem',
                    preparation: 'ipsum',
                },
                currentUser: {
                    id: user._id
                }
            }
            const fakeRes = new FakeRes()

            await createRecipe(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 201)
            assert.equal(fakeRes.body.recipe.name, 'Banana')
            assert.equal(fakeRes.body.recipe.userId, user._id)
        })
    })

    describe('#listRecipes', () => {
        it('With Zero Recipes', async () => {
            const fakeReq = {}
            const fakeRes = new FakeRes()

            await listRecipes(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 200)
            assert.equal(fakeRes.body.length, 0)
        })

        it('With One Recipe', async () => {
            const recipe = await recipeService.createRecipe({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
                userId: '6116bdf3ae232b662a9e6348'
            })
            const fakeReq = {}
            const fakeRes = new FakeRes()

            await listRecipes(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 200)
            assert.equal(fakeRes.body.length, 1)
        })

        it('With Many Recipes', async () => {
            const recipe1 = await recipeService.createRecipe({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
                userId: '6116bdf3ae232b662a9e6348'
            })
            const recipe2 = await recipeService.createRecipe({
                name: 'banana',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
                userId: '6116bdf3ae232b662a9e6348'
            })
            const fakeReq = {}
            const fakeRes = new FakeRes()

            await listRecipes(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 200)
            assert.equal(fakeRes.body.length, 2)
        })
    })

    describe('#showRecipe', () => {
        it('With invalid data', async () => {
            const fakeReq = {
                params: {
                    id: ''
                }
            }
            const fakeRes = new FakeRes()

            await showRecipe(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 404)
            assert.equal(fakeRes.body.message, 'recipe not found')
        })

        it('With valid data', async () => {
            const recipe = await recipeService.createRecipe({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
                userId: '6116bdf3ae232b662a9e6348'
            })
            const fakeReq = {
                params: {
                    id: recipe._id
                }
            }
            const fakeRes = new FakeRes()

            await showRecipe(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 200)
            assert.equal(fakeRes.body.name, recipe.name)
        })
    })

    describe('#destroyRecipe', () => {
        it('With invalid data', async () => {
            const fakeReq = {
                params: {
                    id: '1'
                }
            }
            const fakeRes = new FakeRes()
            await destroyRecipe(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 404)
            assert.equal(fakeRes.body.message, 'recipe not found')
        })

        it('With valid data', async () => {
            const recipe = await recipeService.createRecipe({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
                userId: '6116bdf3ae232b662a9e6348'
            })
            const fakeReq = {
                params: {
                    id: recipe._id
                }
            }
            const fakeRes = new FakeRes()

            await destroyRecipe(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 204)
            assert.equal(fakeRes.body, '')
        })
    })

    describe('#updateRecipe', () => {
        it('With invalid data', async () => {
            const fakeReq = {
                body: {
                    name: '',
                    ingredients: '',
                    preparation: '',
                },
                params: {
                    id: '1'
                }
            }
            const fakeRes = new FakeRes()

            await updateRecipe(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 404)
            assert.equal(fakeRes.body.message, 'recipe not found')
        })

        it('With valid data', async () => {
            const recipe = await recipeService.createRecipe({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
                userId: '6116bdf3ae232b662a9e6348'
            })
            const fakeReq = {
                body: {
                    name: 'banana atualizada',
                    ingredients: 'banana, açúcar',
                    preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
                },
                params: {
                    id: recipe._id
                }
            }
            const fakeRes = new FakeRes()

            await updateRecipe(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 200)
            assert.equal(fakeRes.body.name, 'banana atualizada')
        })
    })
});
