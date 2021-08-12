const RecipeModel = require('./recipe_model');
const { RecipeGenericException } = require('./recipe_exeptions');

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
};