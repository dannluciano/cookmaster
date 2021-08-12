function RecipeGenericException() {
    this.errorCode = 400;
    this.message = 'Invalid entries. Try again.';
}

function RecipeNotExistsException() {
    this.errorCode = 404;
    this.message = 'recipe not found';
}

module.exports = {
    RecipeGenericException,
    RecipeNotExistsException,
};