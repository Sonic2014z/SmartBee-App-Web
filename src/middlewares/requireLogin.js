function requireLogin(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.redirect('/'); // redirige al login si no hay sesión
    }
    next();
}

module.exports = requireLogin;