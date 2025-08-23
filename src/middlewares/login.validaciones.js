const {body} = require('express-validator');
const jwt = require('jsonwebtoken');

const validarLogin = [

]
// API para obtener datos del usuario logueado (intento de midelware)
/*
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



function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Expira en 1 hora
  );
}

module.exports = {validarLogin};

///////////////////////////////////

function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.usuario; // asumimos que ya fue autenticado con JWT
    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ msg: 'No tienes permisos para acceder aquí' });
    }
    next();
  };
}

//////////////////////////////////////

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ msg: 'Token requerido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ msg: 'Token inválido' });
    req.usuario = usuario; // guardamos datos en la request
    next();
  });
}

////////////////////////////////////////
// uso en rutas

router.get('/panel-admin', verificarToken, (req, res) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ msg: 'No tienes permisos' });
  }
  res.send('Bienvenido admin');
});
*/