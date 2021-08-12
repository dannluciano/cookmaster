const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../configs');
const userService = require('../../users/user_service');
const { AuthenticationGenericException } = require('./authentication_exeptions');
const { authenticate } = require('./authentication_service');

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                throw new AuthenticationGenericException();
            }
            
            const user = await userService.findUser(email);
            const userPresenter = await authenticate(user, password);
            const token = await jwt.sign(userPresenter, JWT_SECRET);

            return res.status(200).json({ token });
        } catch (error) {
            return res.status(error.errorCode).json({ message: error.message });
        }
    },
};