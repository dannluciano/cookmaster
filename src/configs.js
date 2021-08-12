const DB_NAME = 'Cookmaster';
const MONGO_DB_URL = 'mongodb://localhost:27017/';
// const MONGO_DB_URL = 'mongodb://mongodb:27017/';

const JWT_SECRET = process.env.SECRET || '8EmegxVmLQdJAjsgjUoHhVwgeRzb09fgP9EvIsITgF8=';

module.exports = {
    MONGO_DB_URL, 
    DB_NAME,
    JWT_SECRET,
};