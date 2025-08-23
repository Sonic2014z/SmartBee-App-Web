const express = require('express');
const routes = require('./routes/routes.js')
const morgan = require('morgan');
const path = require('path');
// const session = require('express-session');
// const bcrypt = require('bcrypt');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 3000;

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// clave secreta para firmar JWT
// const JWT_SECRET = "mi_clave_super_secreta"; 
// Configuración de sesiones
// app.use(session({
//    secret: 'smartbee_secret_key',
//    resave: false,
//    saveUninitialized: true
// }));

//configuraciones y layout
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(express.static('public'));

// archivo de rutas
app.use(routes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});