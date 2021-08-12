function RecipeGenericException() {
    this.errorCode = 400;
    this.message = 'Invalid entries. Try again.';
}

module.exports = {
    RecipeGenericException,
};