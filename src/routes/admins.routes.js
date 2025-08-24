const { Router } = require('express');
const app = Router();

// controlador 
const adminController = require('../db/controller/admin.controller');

// 1 Obtener todos los usuarios
app.get('/usuarios', adminController.getUsuarios);

// 2 Obtener nodos
app.get('/nodos', adminController.getNodos);

// 3 Vista nuevo nodo
app.get('/nuevonodo', adminController.getNuevoNodo);

// 4 Panel administrador
app.get('/paneladministrador', adminController.getPanel);

// 5 Vista registro usuario
app.get('/usuarios/nuevo', adminController.getRegistroUsuario);

// 6 Registrar usuario
app.post('/usuarios/registrar', adminController.postRegistrarUsuario);

// 7 Eliminar usuario
app.get('/usuarios/eliminar/:id', adminController.deleteUsuario);

// 8 Vista editar usuario
app.get('/usuarios/editar/:id', adminController.getEditarUsuario);

// 9 Editar usuario (POST)
app.post('/usuarios/editar/:id', adminController.postEditarUsuario);

// 10 Insertar nuevo nodo
app.post('/nuevonodo', adminController.postNuevoNodo);

// 11 Nodos de usuario
app.get('/nodos/:id', adminController.getNodosByUsuario);

// 12 Info nodo específico
app.get('/nodos/view/:nodoId', adminController.getNodoView);

module.exports = app;
