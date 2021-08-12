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
};