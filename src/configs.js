const DB_NAME = 'Cookmaster';
let MONGO_DB_URL = 'mongodb://localhost:27017/Cookmaster';

if (process.env.NODE_ENV === 'test') {
    MONGO_DB_URL = 'mongodb://mongodb:27017/Cookmaster';
}

const config = {
    MONGO_DB_URL, 
    DB_NAME,
};

module.exports = config;