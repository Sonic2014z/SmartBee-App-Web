const { Router } = require('express');
const app = Router();

//middlewares
const checkValidations = require('../middlewares/checkValidations');
const { validarLogin } = require('../middlewares/login.validaciones');

// controlador 
const loginController = require ('../db/controller/login.controller');

// Ruta para procesar login
app.post('/login', checkValidations, loginController.login);

// Ruta para logout
app.get('/logout', loginController.logout);

module.exports = app;

// ejemplo de como deben queddar las rutas