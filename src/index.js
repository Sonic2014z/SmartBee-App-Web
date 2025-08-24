const express = require('express');
const routes = require('./routes/routes.js')
const morgan = require('morgan');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 3000;

//configuraciones y layout
app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(express.static(path.join(__dirname, 'public')));

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// archivo de rutas
app.use(routes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// esto funcion que ayuda tal cosa tal componente


// consultas base dde datos  ->  bd controladores segun la entidad
// logica controladores -> bd controladores segun la entidad
// lo que no sepan en este archivo solo con comentario de que hace y como funciona

