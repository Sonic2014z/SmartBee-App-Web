// middlewares/checkValidations.js
const { validationResult } = require('express-validator');

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // puedes devolver en JSON
    return res.status(400).json({ errores: errors.array() });

    // o si usas vistas EJS, podrías hacer:
    // return res.status(400).render('gatitos', { errores: errors.array(), data: req.body });
  }
  next();
};

module.exports = checkValidations;