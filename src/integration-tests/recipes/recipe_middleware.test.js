const assert = require('assert/strict');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userService = require('../../users/user_service');
const recipeService = require('../../recipes/recipe_service');
const { loadRecipe, isOwnerOrAdmin } = require('../../recipes/recipe_middleware');
const { FakeRes } = require('../test_utils');
const dbHandler = require('../db_utils');

const { JWT_SECRET } = require('../../configs');


describe('Recipe Middleware', () => {

    before(async () => await dbHandler.connect());

    afterEach(async () => await dbHandler.clearDatabase());

    after(async () => await dbHandler.closeDatabase());

    describe('#loadRecipe', () => {
        it('with id invalid', async () => {
            const fakeReq = {
                params: {
                    id: '61167f6e5a01e23197ab2673'
                }
            }
            const fakeRes = new FakeRes()
            const fakeNext = () => { }
            await loadRecipe(fakeReq, fakeRes, fakeNext)
            assert.equal(fakeRes.status(), 404)
            assert.equal(fakeRes.body.message, 'recipe not found')
        })
        it('with id valid', async () => {
            const result = await mongoose.connection.collections.recipes.insertOne({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
            })
            const fakeReq = {
                params: {
                    id: result.insertedId
                }
            }
            const fakeRes = new FakeRes()
            const fakeNext = () => { }
            await loadRecipe(fakeReq, fakeRes, fakeNext)

            assert.ok(fakeReq.recipe)
            assert.ok(fakeReq.recipe._id)
        })
    })
    describe('#isOwnerOrAdmin', () => {
        it('without authentication token', async () => {
            const fakeReq = {
                params: {
                    id: '61167f6e5a01e23197ab2673'
                },
                headers: {
                    authorization: null
                }
            }
            const fakeRes = new FakeRes()
            const fakeNext = () => { }
            await isOwnerOrAdmin(fakeReq, fakeRes, fakeNext)
            assert.equal(fakeRes.status(), 401)
            assert.equal(fakeRes.body.message, 'missing auth token')
        })

        it('with invalid authentication token', async () => {
            const fakeReq = {
                params: {
                    id: '61167f6e5a01e23197ab2673'
                },
                headers: {
                    authorization: ''
                }
            }
            const fakeRes = new FakeRes()
            const fakeNext = () => { }
            await isOwnerOrAdmin(fakeReq, fakeRes, fakeNext)
            assert.equal(fakeRes.status(), 401)
            assert.equal(fakeRes.body.message, 'missing auth token')
        })

        it('with valid authentication token', async () => {
            const userAdmin = { email: 'admin@admin.com', role: 'admin' }
            const token = jwt.sign(userAdmin, JWT_SECRET)
            const fakeReq = {
                params: {
                    id: '61167f6e5a01e23197ab2673'
                },
                headers: {
                    authorization: token
                }
            }
            const fakeRes = new FakeRes()
            const fakeNext = () => { }
            await isOwnerOrAdmin(fakeReq, fakeRes, fakeNext)
            assert.equal(fakeReq.currentUser.email, 'admin@admin.com')
            assert.equal(fakeReq.currentUser.role, 'admin')
        })

        it('with valid authentication token but not admin or owner', async () => {
            const { user } = await userService.createUser({
                name: 'Dann Luciano',
                email: 'dannluciano@gmail.com',
                password: '12345678',
                role: 'user'
            })
            const recipe = await recipeService.createRecipe({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
                userId: '6116bdf3ae232b662a9e6348'
            })
            const token = jwt.sign(user, JWT_SECRET)
            const fakeReq = {
                params: {
                    id: recipe._id
                },
                headers: {
                    authorization: token
                },
                recipe: recipe
            }
            const fakeRes = new FakeRes()
            const fakeNext = () => { }
            
            await isOwnerOrAdmin(fakeReq, fakeRes, fakeNext)

            assert.equal(fakeRes.status(), 401)
            assert.equal(fakeRes.body.message, 'permission denied')
        })

        it('with valid authentication token and owner', async () => {
            const { user } = await userService.createUser({
                name: 'Dann Luciano',
                email: 'dannluciano@gmail.com',
                password: '12345678',
                role: 'user'
            })
            const recipe = await recipeService.createRecipe({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
                userId: user._id
            })
            const userPresenter = {
                id: user._id,
                email: user.email,
                role: user.role,
            }
            const token = jwt.sign(userPresenter, JWT_SECRET)
            const fakeReq = {
                params: {
                    id: recipe._id
                },
                headers: {
                    authorization: token
                },
                recipe: recipe
            }
            const fakeRes = new FakeRes()
            const fakeNext = () => {
            }
            
            await isOwnerOrAdmin(fakeReq, fakeRes, fakeNext)
            
            assert.ok(true)
        })

    })
});
