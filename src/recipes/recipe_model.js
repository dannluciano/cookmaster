const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ingredients: {
        type: String,
        required: true,
    },
    preparation: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    image: {
        type: String,
    },
});

const RecipeMode = mongoose.model('Recipe', recipeSchema);

module.exports = RecipeMode;