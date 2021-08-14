const mongoose = require('mongoose');

module.exports.connect = async () => {
    const mongoDbUrl = 'mongodb://localhost:27017/Cookmaster';

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    mongoose.set('useCreateIndex', true);
    await mongoose.connect(mongoDbUrl, mongooseOpts);
}

module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    // await mongod.stop();
}

module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}