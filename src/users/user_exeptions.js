function UserEmailAlreadyRegisteredException() {
    this.errorCode = 409;
    this.message = 'Email already registered';
}

function UserGenericException() {
    this.errorCode = 400;
    this.message = 'Invalid entries. Try again.';
}

module.exports = {
    UserEmailAlreadyRegisteredException,
    UserGenericException,
};