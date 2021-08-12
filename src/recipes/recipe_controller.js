const recipeService = require('./recipe_service');
const { RecipeGenericException } = require('./recipe_exeptions');

module.exports = {
    createRecipe: async (req, res) => {
        const { name, ingredients, preparation } = req.body;
        const userId = req.currentUser.id;

        try {
            if (!name || !ingredients || !preparation) {
                throw new RecipeGenericException();
            }

            const recipe = await recipeService.createRecipe(
                { name, ingredients, preparation, userId },
            );

            return res.status(201).json({ recipe });
        } catch (error) {
            return res.status(error.errorCode).json({ message: error.message });
        }
    },
    listRecipes: async (req, res) => {
        try {
            const recipes = await recipeService.getAllRecipes();
            return res.status(200).json(recipes);
        } catch (error) {
            return res.status(error.errorCode).json({ message: error.message });
        } 
    },
    showRecipe: async (req, res) => {
        try {
            const recipeId = req.params.id;
            const recipe = await recipeService.getRecipeById(recipeId);
            return res.status(200).json(recipe);
        } catch (error) {
            return res.status(error.errorCode).json({ message: error.message });
        }
    },
    
};