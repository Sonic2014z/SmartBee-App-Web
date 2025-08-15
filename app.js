const express = require('express');
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
// Ruta para procesar login
const bcrypt = require('bcrypt');

app.post('/login', (req, res) => {
    const { identificador, clave } = req.body;

    if(!identificador || !clave){
        return res.json({ success: false, message: 'Por favor ingresa identificador y clave' });
    }

    const query = 'SELECT * FROM usuario WHERE id = ? LIMIT 1';
    oConexion.query(query, [identificador], (err, results) => {
        if(err) {
            console.error(err);
            return res.json({ success: false, message: 'Error en la base de datos' });
        }

        if(results.length === 0){
            return res.json({ success: false, message: 'Identificador incorrecto' });
        }

        const usuario = results[0];

        // Comparar la contraseña usando bcrypt
        bcrypt.compare(clave, usuario.clave, (err, esCorrecto) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, message: 'Error al verificar la contraseña' });
            }

            if(esCorrecto){
                return res.json({ success: true, message: 'Login exitoso' });
            } else {
                return res.json({ success: false, message: 'Contraseña incorrecta' });
            }
        });
    });
});

app.get('/panel', (req, res) => {
    res.send('<h1>Bienvenido al Panel de SmartBee</h1>');
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
