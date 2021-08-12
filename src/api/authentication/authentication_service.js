const { AuthenticationFailException } = require('./authentication_exeptions');

module.exports = {
    authenticate: async (user, password) => {
        if (!user || user.password !== password) {
            throw new AuthenticationFailException();
        }

        const userPresenter = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        return userPresenter;
    },
};