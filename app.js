const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require("mysql");
const app = express();
const port = 3000;

const oMySQL = require("mysql");
const oConexion = oMySQL.createConnection({
    host: "localhost",
    database: "smartbee",
    user: "root",
    password: ""
});

app.set('view engine', 'ejs');
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
    res.render('index');
});

app.get('/recuperar', (req, res) => {
    res.render('recuperar');
});

app.get('/restablecer', (req, res) => {
    res.render('restablecer');
});
app.get('/panelapicultor', (req, res) => {
    res.render('panelapicultor');
});
app.get('/paneladministrador', (req, res) => {
    res.render('paneladministrador');
});

app.get('/configuracionperfil', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/'); // si no hay sesión vuelve al login
    }
    res.render('configuracionperfil');
});

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



app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
