const mongoose = require('mongoose');
const configs = require('./configs');

mongoose.connect(configs.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, '[DataBase] connection error:'));

module.exports = db;