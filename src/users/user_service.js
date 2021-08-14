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
            const userExist = await UserModel.findOne({ email: user.email });
            if (userExist) {
                throw new UserEmailAlreadyRegisteredException();
            }
            await userModel.save();
            const { name, email, role, _id } = userModel;
            return { user: { name, email, role, _id } };
        } catch (error) {
            if (error instanceof UserEmailAlreadyRegisteredException) { throw error; }
            throw new UserGenericException();
        }
    },
    findUser: async (email) => {
        const user = await UserModel.findOne({ email }).exec();
        return user;
    },
};