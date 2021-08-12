const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../configs');
const { AuthenticationTokenException } = require('./authentication_exeptions');

module.exports = {
    requireLogin: async (req, res, next) => {
        try {
            const token = req.headers.authorization;

            if (!token) {
                throw new AuthenticationTokenException();
            }

            const payload = await jwt.verify(token, JWT_SECRET);

            req.currentUser = payload;

            next();
        } catch (e) {
            const error = new AuthenticationTokenException();
            return res.status(error.errorCode).json({ message: error.message });
        }
    },
};