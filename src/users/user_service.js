const UserModel = require('./user_model');
const { UserGenericException, UserEmailAlreadyRegisteredException } = require('./user_exeptions');

module.exports = {
    createUser: async (user) => {
        try {
            const userModel = new UserModel(user);
            const errors = userModel.validateSync();
            if (errors) {
                throw new UserGenericException();
            }
            await userModel.save();
            const { name, email, role, _id } = userModel;
            return {
                user: { name, email, role, _id },
            };
        } catch (error) {
            if (error.code === 11000) {
                throw new UserEmailAlreadyRegisteredException();
            }
            throw new UserGenericException();
        }
    },
};