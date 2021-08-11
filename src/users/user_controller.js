const userService = require('./user_service');
const { UserGenericException } = require('./user_exeptions');

module.exports = {
    createUser: async (req, res) => {
        const { name, email, password } = req.body;

        try {
            if (!name || !email || !password) {
                throw new UserGenericException();
            }
        
            const user = await userService.createUser({ name, email, password });
            return res.status(201).json(user);
        } catch (error) {
            return res.status(error.errorCode).json({ message: error.message });
        }
    },
};