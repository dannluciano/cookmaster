const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const configs = require('../configs');

const userController = require('../users/user_controller');
const authenticationController = require('./authentication/authentication_controller');
const recipesController = require('../recipes/recipe_controller');

const authenticationMiddleware = require('./authentication/authentication_middleware');
const recipeMiddleware = require('../recipes/recipe_middleware');

const databaseURL = configs.MONGO_DB_URL + configs.DB_NAME;

mongoose.set('useCreateIndex', true);
mongoose.connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true });
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

app.post('/users', 
  userController.createUser);
app.post('/login', 
  authenticationController.login);
app.get('/recipes', 
  recipesController.listRecipes);
app.get('/recipes/:id', 
  recipesController.showRecipe);
app.post('/recipes', 
  authenticationMiddleware.requireLogin, 
  recipesController.createRecipe);
app.put('/recipes/:id', 
  recipeMiddleware.loadRecipe, 
  recipeMiddleware.isOwnerOrAdmin, 
  recipesController.updateRecipe);
app.delete('/recipes/:id', 
  recipeMiddleware.loadRecipe,
  recipeMiddleware.isOwnerOrAdmin,
  recipesController.destroyRecipe);

module.exports = app;
