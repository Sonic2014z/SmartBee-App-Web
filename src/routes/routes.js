const { Router } = require('express');
const app = Router();
const admins = require('./admins.routes')
const apicultores = require('./apicultores.routes')
//const login = require('./login.routes')


// esto se suele usar con prefijos en este
// caso por las rutas creadas no es posible
app.use(admins);
app.use(apicultores);
//app.use(login);

// Rutas principales
app.get('/', (req, res) => {
    // Si hay sesión y rol, redirige al panel correspondiente
    if (req.session.userId && req.session.rol) {
        if (req.session.rol === 'admin') {
            return res.redirect('/paneladministrador');
        } else {
            return res.redirect('/panelapicultor');
        }
    }
    // Tomar en consideración este ejemplo para la utilización de layouts ("layout: false" equivale a no tener layout).
    res.render('index', { layout: false, title: 'Panel Principal | SmartBee' });
});

app.get('/recuperar', (req, res) => {
    res.render('recuperar', { layout: false });
});

app.get('/restablecer', (req, res) => {
    res.render('restablecer', { layout: false });
});

// Protegido con requireLogin para evitar acceso sin sesión
app.get('/configuracionperfil', requireLogin, (req, res) => {
    res.render('configuracionperfil', { layout: "layout-apicultor", title: "Configuración | SmartBee" });
});


app.get('/panel', (req, res) => {
    res.send('<h1>Bienvenido al Panel de SmartBee</h1>');
});

module.exports = app;