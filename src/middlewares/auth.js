const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "mi_clave_super_secreta";

function verificarToken(req, res, next) {
  // Ignorar favicon.ico
  if (req.path === '/favicon.ico') {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato: Bearer token

  if (!token) {
    return res.status(401).json({ msg: 'Token requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ msg: 'Token inválido o expirado' });
    req.usuario = usuario; 
    next();
  });
}

module.exports = { verificarToken };