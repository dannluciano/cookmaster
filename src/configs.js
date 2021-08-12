const DB_NAME = 'Cookmaster';
let MONGO_DB_URL = 'mongodb://localhost:27017/Cookmaster';

if (process.env.NODE_ENV === 'test') {
    MONGO_DB_URL = 'mongodb://mongodb:27017/Cookmaster';
}

const JWT_SECRET = process.env.SECRET || '8EmegxVmLQdJAjsgjUoHhVwgeRzb09fgP9EvIsITgF8=';

module.exports = {
    MONGO_DB_URL, 
    DB_NAME,
    JWT_SECRET,
};