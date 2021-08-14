function RecipeGenericException() {
    this.errorCode = 400;
    this.message = 'Invalid entries. Try again.';
}

class RecipeNotExistsException extends Error {
    constructor() {
        super();
        this.errorCode = 404;
        this.message = 'recipe not found';
    }
}

module.exports = {
    RecipeGenericException,
    RecipeNotExistsException,
};