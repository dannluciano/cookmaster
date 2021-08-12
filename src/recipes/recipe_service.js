const RecipeModel = require('./recipe_model');
const { RecipeGenericException, RecipeNotExistsException } = require('./recipe_exeptions');

module.exports = {
    createRecipe: async (recipe) => {
        try {
            const recipeModel = new RecipeModel(recipe);
            const errors = recipeModel.validateSync();
            if (errors) {
                throw new RecipeGenericException();
            }
            await recipeModel.save();
            
            return recipeModel;
        } catch (error) {
            throw new RecipeGenericException();
        }
    },
    getAllRecipes: async () => {
        const recipes = await RecipeModel.find();
        return recipes;
    },
    getRecipeById: async (id) => {
        try {
            const recipe = await RecipeModel.findById(id).exec();
            return recipe;
        } catch (error) {
            throw new RecipeNotExistsException();
        }
    },
};