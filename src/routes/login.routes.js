const { Router } = require('express');
const router = Router();

// Middlewares
const checkValidations = require('../middlewares/checkValidations');
const { validarLogin } = require('../middlewares/login.validaciones');
const { verificarToken } = require('../middlewares/auth');
const { verificarRol } = require('../middlewares/roles.validations');

// Controlador
const loginController = require('../db/controller/login.controller');

// ----------------------------
// Rutas públicas
// ----------------------------

// Procesar login (validaciones + controlador)
router.post('/login', validarLogin, checkValidations, loginController.login);

// Cerrar sesión
router.get('/logout', loginController.logout);

module.exports = router;
