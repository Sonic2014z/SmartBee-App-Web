const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const oMySQL = require("mysql");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const port = 3000;

const oConexion = oMySQL.createConnection({
    host: "localhost",
    database: "smartbee",
    user: "root",
    password: ""
});

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

    // Middleware para requerir login en rutas privadas
    // Si el usuario no tiene sesión, lo redirige al login
    function requireLogin(req, res, next) {
        if (!req.session.userId) {
            // Comentario: Si no hay sesión, redirige a la página principal (login)
            return res.redirect('/');
        }
        next();
    }


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de sesiones
app.use(session({
    secret: 'smartbee_secret_key',
    resave: false,
    saveUninitialized: true
}));

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

app.get('/admin/usuarios', (req, res) => {
    const sql = "SELECT usuario.id, usuario.nombre, usuario.apellido, usuario.rol FROM usuario";
    oConexion.query(sql, (err, filas) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener usuarios: " + err.message);
        }
        // Aqui el layout para la vista de admin es "layout".
        res.render('admin-usuarios', { usuarios: filas, layout: "layout", title: "Usuarios | SmartBee" });
    });
});

app.get('/admin/nodos', (req, res) => {
    res.render('admin-nodos', { layout: "layout", title: 'Nodos | SmartBee' });
});

app.get('/recuperar', (req, res) => {
    res.render('recuperar', { layout: false });
});

app.get('/restablecer', (req, res) => {
    res.render('restablecer', {layout: false });
});


// Protegido con requireLogin para evitar acceso sin sesión
app.get('/panelapicultor', requireLogin, (req, res) => {
    // Para la vista de apicultor el layout es: "layout-apicultor"
    res.render('panelapicultor', { layout: "layout-apicultor", title: "Panel Principal | SmartBee"});
});


// Protegido con requireLogin para evitar acceso sin sesión
app.get('/paneladministrador', requireLogin, (req, res) => {
    res.render('admin', { title: "Panel Principal | SmartBee "});
});


// Protegido con requireLogin para evitar acceso sin sesión
app.get('/configuracionperfil', requireLogin, (req, res) => {
    res.render('configuracionperfil', { layout: "layout-apicultor", title: "Configuración | SmartBee"});
});

// Ruta para procesar login
app.post('/login', (req, res) => {
    const { identificador, clave } = req.body;

    if (!identificador || !clave) {
        return res.json({ success: false, message: 'Por favor ingresa identificador y clave' });
    }

    const query = 'SELECT * FROM usuario WHERE id = ? LIMIT 1';
    oConexion.query(query, [identificador], (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Error en la base de datos' });
        }

        if (results.length === 0) {
            return res.json({ success: false, message: 'Identificador incorrecto' });
        }

        const usuario = results[0];

        // Comparar contraseña encriptada
        bcrypt.compare(clave, usuario.clave, (err, esCorrecto) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: 'Error al verificar la contraseña' });
            }

            if (esCorrecto) {
                // Guardar sesión
                req.session.userId = usuario.id;
                req.session.rol = usuario.rol;

                return res.json({
                    success: true,
                    message: 'Login exitoso',
                    rol: usuario.rol
                });
            } else {
                return res.json({ success: false, message: 'Contraseña incorrecta' });
            }
        });
    });
});

// API para obtener datos del usuario logueado
app.get('/api/usuario', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'No hay usuario logueado' });
    }

    const query = 'SELECT id, nombre, apellido, comuna, rol, activo FROM usuario WHERE id = ? LIMIT 1';
    oConexion.query(query, [req.session.userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error en DB' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json(results[0]);
    });
});

app.get('/panel', (req, res) => {
    res.send('<h1>Bienvenido al Panel de SmartBee</h1>');
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/'); // Redirigir al inicio después de cerrar sesión
    });
}
);  





app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
