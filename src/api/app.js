const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const configs = require('../configs');

const userController = require('../users/user_controller');
const authenticationController = require('./authentication/authentication_controller');

mongoose.set('useCreateIndex', true);
mongoose.connect(configs.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, '[DataBase] connection error:'));

const app = express();

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.post('/users', userController.createUser);
app.post('/login', authenticationController.login);


module.exports = app;
