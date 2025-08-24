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

module.exports = app;

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

// ejemplo de como deben queddar las rutas