const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const oConexion = require('../conexion'); 
// tu conexión a BD

const JWT_SECRET = process.env.JWT_SECRET || "mi_clave_super_secreta";

const loginController = {
  // --------------------
  // LOGIN
  // --------------------
  login: (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM usuario WHERE email = ? LIMIT 1';
    oConexion.query(query, [email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error en la base de datos' });
      }

      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
      }

      const usuario = results[0];

      // Comparar contraseña
      bcrypt.compare(password, usuario.clave, (err, esCorrecto) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Error al verificar contraseña' });
        }

        if (!esCorrecto) {
          return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign(
          { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.json({
          success: true,
          message: 'Login exitoso',
          token,
          rol: usuario.rol
        });
      });
    });
  },

  // --------------------
  // LOGOUT
  // --------------------
  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
      }
      res.json({ success: true, message: 'Sesión cerrada' });
    });
  },

  // --------------------
  // PERFIL (ejemplo)
  // --------------------
  perfil: (req, res) => {
    res.json({
      success: true,
      usuario: req.usuario
    });
  }
};

module.exports = loginController;
