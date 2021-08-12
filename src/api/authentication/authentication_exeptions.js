function AuthenticationFailException() {
    this.errorCode = 401;
    this.message = 'Incorrect username or password';
}

function AuthenticationGenericException() {
    this.errorCode = 401;
    this.message = 'All fields must be filled';
}

function AuthenticationTokenException() {
    this.errorCode = 401;
    this.message = 'jwt malformed';
}

module.exports = {
    AuthenticationFailException,
    AuthenticationGenericException,
    AuthenticationTokenException,
};