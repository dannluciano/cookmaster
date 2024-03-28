const path = require('path');

const DB_NAME = 'Cookmaster';
const MONGO_DB_URL = process.env.MONGO_URL || `mongodb://localhost:27017/${DB_NAME}`;

const JWT_SECRET = process.env.SECRET || '8EmegxVmLQdJAjsgjUoHhVwgeRzb09fgP9EvIsITgF8=';

const UPLOAD_DIR = path.join(__dirname, '.', 'uploads');
const DOMAIN = process.env.DOMAIN || 'localhost:3000';
const UPLOAD_PATH = `${DOMAIN}/src/uploads/`;

module.exports = {
  MONGO_DB_URL,
  DB_NAME,
  JWT_SECRET,
  UPLOAD_DIR,
  UPLOAD_PATH,
};
