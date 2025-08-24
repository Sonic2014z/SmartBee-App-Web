const { Router } = require('express');
const app = Router();

// Importar subrutas
const admins = require('./admins.routes');
const apicultores = require('./apicultores.routes');
const login = require('./login.routes');

// Middlewares
const { verificarToken } = require('../middlewares/auth');
const { verificarRol } = require('../middlewares/roles.validations');
const requireLogin = require('../middlewares/requireLogin');

// ----------------------------
// Rutas principales
// ----------------------------
app.get('/', (req, res) => {
    res.render('index', { layout: false, title: 'Panel Principal | SmartBee' });
});

app.get('/restablecer', (req, res) => {
    res.render('restablecer', { layout: false });
});

app.get('/configuracionperfil', requireLogin, (req, res) => {
    res.render('configuracionperfil', { layout: "layout-apicultor", title: "Configuración | SmartBee" });
});

app.get('/panel', verificarToken, (req, res) => {
    res.send('<h1>Bienvenido al Panel de SmartBee</h1>');
});

// ----------------------------
// Montar rutas hijas SIN prefijos
// ----------------------------

app.use(login); 
// login sigue libre, sin token
app.use(verificarToken, verificarRol(['admin']), admins);
app.use(verificarToken, verificarRol(['apicultor', 'admin']), apicultores);

module.exports = app;
