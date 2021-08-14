const assert = require('assert/strict');
const recipeService = require('../../recipes/recipe_service');
const dbHandler = require('../db_utils');


const mongoose = require('mongoose');
const mongoDbUrl = 'mongodb://localhost:27017/Cookmaster';

describe('Recipe Service', () => {

    before(async () => await dbHandler.connect());

    afterEach(async () => await dbHandler.clearDatabase());

    after(async () => await dbHandler.closeDatabase());

    describe('#createRecipe', () => {
        it('with invalid data', async () => {
            try {
                const recipe = await recipeService.createRecipe();
            } catch (err) {
                assert.equal(err.errorCode, 400)
                assert.equal(err.message, 'Invalid entries. Try again.')
            }
        })

        it('with valid data', async () => {
            const recipe = await recipeService.createRecipe({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
            })
            assert.ok(recipe._id)
        })
    })

    describe('#getAllRecipes', () => {
        it('with zero recipes', async () => {
            const recipes = await recipeService.getAllRecipes()
            assert.equal(recipes.length, 0)
        })

        it('with many recipes', async () => {
            const recipe = await recipeService.createRecipe({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
            })
            const recipes = await recipeService.getAllRecipes()
            assert.equal(recipes.length, 1)
        })
    })

    describe('#getRecipeById', () => {
        it('with id invalid', async () => {
            await assert.rejects(
                async () => {
                    await recipeService.getRecipeById('61167f6e5a01e23197ab2673')
                },
                (err) => {
                    assert.equal(err.errorCode, 404);
                    assert.equal(err.message, 'recipe not found');
                    return true;
                }
            );
        })

        it('with id valid', async () => {
            const recipe = await recipeService.createRecipe({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
            })
            const findRecipe = await recipeService.getRecipeById(recipe.id)
            assert.equal(findRecipe.name, recipe.name)
        })
    })

    describe('#updateRecipe', () => {
        it('with id invalid', async () => {
            await assert.rejects(
                async () => {
                    await recipeService.updateRecipe('61167f6e5a01e23197ab2673', {})
                },
                (err) => {
                    assert.equal(err.errorCode, 404);
                    assert.equal(err.message, 'recipe not found');
                    return true;
                }
            );
        })

        it('with id and data valid', async () => {
            const recipe = await recipeService.createRecipe({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
            })
            const findRecipe = await recipeService.getRecipeById(recipe.id)
            const updateRecipe = await recipeService.updateRecipe(findRecipe._id, {
                name: 'banana caramelizada atualizada',
                ingredients: 'banana, açúcar, canela',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana, finalize com a canela',
            })
            assert.equal(updateRecipe.name, 'banana caramelizada atualizada')
            assert.equal(updateRecipe.ingredients, 'banana, açúcar, canela')
            assert.equal(updateRecipe.preparation, 'coloque o açúcar na frigideira até virar caramelo e jogue a banana, finalize com a canela')
        })
    })

    describe('#destroyRecipe', () => {
        it('with id invalid', async () => {
            await assert.rejects(
                async () => {
                    await recipeService.destroyRecipe('61167f6e5a01e23197ab2673')
                },
                (err) => {
                    assert.equal(err.errorCode, 404);
                    assert.equal(err.message, 'recipe not found');
                    return true;
                }
            );
        })

        it('with id valid', async () => {
            const recipe = await recipeService.createRecipe({
                name: 'banana caramelizada',
                ingredients: 'banana, açúcar',
                preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
            })
            await recipeService.destroyRecipe(recipe.id)
            await assert.rejects(
                async () => {
                    await recipeService.getRecipeById(recipe.id)
                },
                (err) => {
                    assert.equal(err.errorCode, 404);
                    assert.equal(err.message, 'recipe not found');
                    return true;
                }
            );
        })
    })
});