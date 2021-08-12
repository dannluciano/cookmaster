const recipeService = require('./recipe_service');
const { RecipeGenericException } = require('./recipe_exeptions');
const { UPLOAD_PATH } = require('../configs');

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
            const { id } = req.params;
            const recipe = await recipeService.getRecipeById(id);
            return res.status(200).json(recipe);
        } catch (error) {
            return res.status(error.errorCode).json({ message: error.message });
        }
    },
    updateRecipe: async (req, res) => {
        try {
            const { name, ingredients, preparation } = req.body;
            const { id } = req.params;
            const recipe = await recipeService.updateRecipe(id, { name, ingredients, preparation });
            return res.status(200).json(recipe);
        } catch (error) {
            return res.status(error.errorCode).json({ message: error.message });
        }
    },
    destroyRecipe: async (req, res) => {
        try {
            const { id } = req.params;
            await recipeService.destroyRecipe(id);
            res.status(204).json();
        } catch (error) {
            return res.status(error.errorCode).json({ message: error.message });
        }
    },
    addImageToRecipe: (req, res) => {
        try {
            req.recipe.image = UPLOAD_PATH + req.file.filename;
            req.recipe.save();
            res.status(200).json(req.recipe);
        } catch (error) {
            return res.status(error.errorCode).json({ message: error.message });
        }
    },
};