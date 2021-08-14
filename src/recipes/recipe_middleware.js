const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs');
const recipeService = require('./recipe_service');

module.exports = {
    loadRecipe: async (req, res, next) => {
        try {
            const recipeId = req.params.id;
            const recipe = await recipeService.getRecipeById(recipeId);
            req.recipe = recipe;
            next();
        } catch (e) {
            return res.status(e.errorCode).json({ message: e.message });
        }
    },
    isOwnerOrAdmin: (req, res, next) => {
        try {
            const token = req.headers.authorization;

            if (!token) {
                return res.status(401).json({ message: 'missing auth token' });
            }

            const payload = jwt.verify(token, JWT_SECRET);
            req.currentUser = payload;

            const isAdmin = req.currentUser.role === 'admin';
            const isOwner = req.recipe.userId.equals(req.currentUser.id);

            if (isAdmin || isOwner) {
                next();
            } else {
                return res.status(401).json({ message: 'permission denied' });
            }
        } catch (e) {
            return res.status(401).json({ message: 'jwt malformed' });
        }
    },
};