function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ msg: 'Usuario no autenticado' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ msg: 'No tienes permisos para acceder aquí' });
    }

    next();
  };
}

module.exports = { verificarRol };

