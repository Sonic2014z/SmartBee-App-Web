const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const oMySQL = require("mysql");
const cors = require("cors");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const port = 3000;

const oConexion = oMySQL.createConnection({
    host: "localhost",
    database: "smartbee",
    user: "smartbee.app",
    port: 3306,
    password: "aeshae7JooG1Thah1oz5"
});

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware para requerir login en rutas privadas
// Si el usuario no tiene sesión, lo redirige al login
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        // Comentario: Si no hay sesión, redirige a la página principal (login)
        return res.redirect('/');
    }
    next();
}


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
    // Si hay sesión y rol, redirige al panel correspondiente
    if (req.session.userId && req.session.rol) {
        if (req.session.rol === 'admin') {
            return res.redirect('/paneladministrador');
        } else {
            return res.redirect('/panelapicultor');
        }
    }
    // Tomar en consideración este ejemplo para la utilización de layouts ("layout: false" equivale a no tener layout).
    res.render('index', { layout: false, title: 'Panel Principal | SmartBee' });
});

app.get('/admin/usuarios', (req, res) => {
    const sql = "SELECT usuario.id, usuario.nombre, usuario.apellido, usuario.rol FROM usuario";
    oConexion.query(sql, (err, filas) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener usuarios: " + err.message);
        }
        // Aqui el layout para la vista de admin es "layout".
        res.render('admin-usuarios', { usuarios: filas, layout: "layout", title: "Usuarios | SmartBee" });
    });
});

//vista historica
app.get("/api/datos", (req, res) => {
    const query = "SELECT id, nodo_id, topico, payload, fecha FROM nodo_mensaje"; 
    oConexion.query(query, (err, results) => { 
        if (err) {
            console.error("Error en la consulta:", err);
            res.status(500).json({ error: "Error en la consulta" });
            return;
        }

        const parsedResults = results.map(r => {
            try {
                const payload = JSON.parse(r.payload);
                return { ...r, ...payload };
            } catch {
                return r;
            }
        });

        res.json(parsedResults);
    });
});

app.get('/admin/nodos', (req, res) => {
     const sql = `
        SELECT n.id AS nodo_id,
               n.descripcion AS nodo_desc,
               n.tipo,
               c.id AS colmena_id,
               c.descripcion AS colmena_desc,
               c.latitud AS colmena_lat,
               c.longitud AS colmena_lng,
               e.id AS estacion_id,
               e.descripcion AS estacion_desc,
               e.latitud AS estacion_lat,
               e.longitud AS estacion_lng
        FROM nodo n
        LEFT JOIN nodo_colmena nc ON n.id = nc.nodo_id
        LEFT JOIN colmena c ON nc.colmena_id = c.id
        LEFT JOIN nodo_estacion ne ON n.id = ne.nodo_id
        LEFT JOIN estacion e ON ne.estacion_id = e.id
        ORDER BY n.id;
    `;

    oConexion.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener nodos: " + err.message);
        }

        res.render("admin-nodos", { 
            layout: "layout", 
            title: "Nodos | SmartBee", 
            nodos: results  // 👈 aquí mandamos nodos a la vista
        });
    });
});



app.get('/admin/nuevonodo', (req, res) => {

    const sql = "SELECT id, nombre , apellido , rol FROM usuario ";
    oConexion.query(sql, (err, usuarios) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener usuarios: " + err.message);
        }
        // Aquí el layout para la vista de admin es "layout".
        res.render('admin-nuevonodo', { usuarios, layout: "layout", title: "Nuevo Nodo | SmartBee" });
    });


});



app.get('/recuperar', (req, res) => {
    res.render('recuperar', { layout: false });
});

app.get('/vistahistorica', (req, res) => {
    res.render('vistahistorica', { layout: "layout-apicultor", title: "Vista Histórica | SmartBee" });
});

app.get('/restablecer', (req, res) => {
    res.render('restablecer', { layout: false });
});


// Protegido con requireLogin para evitar acceso sin sesión
app.get('/panelapicultor', requireLogin, (req, res) => {
    // Para la vista de apicultor el layout es: "layout-apicultor"
    res.render('panelapicultor', { layout: "layout-apicultor", title: "Panel Principal | SmartBee" });
});

app.get('/apicultor/alertas', (req, res) => {
    const sql = `
    SELECT 
      na.id,
      na.fecha,
      CASE
        WHEN a.nombre LIKE '%Crític%' OR a.nombre LIKE '%Critic%' THEN 'CRITICO'
        WHEN a.nombre LIKE '%Preventiv%' THEN 'ADVERTENCIA'
        ELSE 'INFORMACION'
      END AS tipo,
      a.nombre,
      a.descripcion,
      n.descripcion AS nodo_descripcion,
      n.tipo       AS nodo_tipo
    FROM nodo_alerta na
    JOIN alerta a ON na.alerta_id = a.id
    JOIN nodo n   ON na.nodo_id   = n.id
    ORDER BY na.fecha DESC
    LIMIT 5
  `;

    oConexion.query(sql, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener alertas");
        }

        // contadores
        const counts = { criticas: 0, advertencias: 0, informativas: 0 };
        for (const r of rows) {
            if (r.tipo === 'CRITICO') counts.criticas++;
            else if (r.tipo === 'ADVERTENCIA') counts.advertencias++;
            else counts.informativas++;
        }

        res.render('apicultor-alertas', { alertas: rows, counts, layout: "layout-apicultor", title: "Alertas | SmartBee" });
    });
});

app.get("/apicultor/alertas-all", (req, res) => {
    const filtro = req.query.tipo;

    // Obtener todas las alertas para contar cada tipo
    oConexion.query(`
    SELECT 
      CASE
        WHEN a.nombre LIKE '%Crític%' OR a.nombre LIKE '%Critic%' THEN 'CRITICO'
        WHEN a.nombre LIKE '%Preventiv%' THEN 'ADVERTENCIA'
        ELSE 'INFORMATIVA'
      END AS tipo
    FROM nodo_alerta na
    JOIN alerta a ON na.alerta_id = a.id
  `, (err, todasAlertas) => {
        if (err) return res.status(500).send("Error al obtener alertas para contadores");

        const counts = { criticas: 0, advertencias: 0, informativas: 0 };
        todasAlertas.forEach(a => {
            if (a.tipo === "CRITICO") counts.criticas++;
            else if (a.tipo === "ADVERTENCIA") counts.advertencias++;
            else counts.informativas++;
        });

        // Obtener alertas con filtro si existe
        let sql = `
      SELECT 
        na.id,
        na.fecha,
        CASE
          WHEN a.nombre LIKE '%Crític%' OR a.nombre LIKE '%Critic%' THEN 'CRITICO'
          WHEN a.nombre LIKE '%Preventiv%' THEN 'ADVERTENCIA'
          ELSE 'INFORMATIVA'
        END AS tipo,
        a.nombre,
        a.descripcion,
        n.tipo AS nodo_tipo,
        n.descripcion AS nodo_descripcion
      FROM nodo_alerta na
      JOIN alerta a ON na.alerta_id = a.id
      JOIN nodo n ON na.nodo_id = n.id
    `;
        const params = [];
        if (filtro) {
            sql += " HAVING tipo = ?";
            params.push(filtro);
        }
        sql += " ORDER BY na.fecha DESC";

        oConexion.query(sql, params, (err, alertas) => {
            if (err) return res.status(500).send("Error al obtener alertas filtradas");

            res.render("apicultor-alertas-all", { alertas, counts, filtro, layout: "layout-apicultor", title: "Alertas | SmartBee" });
        });
    });
});




// Protegido con requireLogin para evitar acceso sin sesión
app.get('/paneladministrador', requireLogin, (req, res) => {
    // 3 queries: total de usuarios, total de nodos, total de alertas.
    const totalUsuarios = new Promise((resolve, reject) => {
        oConexion.query('SELECT COUNT(*) AS total FROM usuario', (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0].total);
        });
    });

    const totalNodos = new Promise((resolve, reject) => {
        oConexion.query('SELECT COUNT(*) AS total FROM nodo', (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0].total);
        });
    });

    const totalAlertas = new Promise((resolve, reject) => {
        oConexion.query('SELECT COUNT(*) AS total FROM nodo_alerta', (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0].total);
        });
    });

    const latestPerNode = new Promise((resolve, reject) => {
        const sql = `
            SELECT nm.nodo_id, nm.payload, nm.fecha
            FROM nodo_mensaje nm
            INNER JOIN (
                SELECT nodo_id, MAX(fecha) AS max_fecha
                FROM nodo_mensaje
                GROUP BY nodo_id
            ) latest ON nm.nodo_id = latest.nodo_id AND nm.fecha = latest.max_fecha
            ORDER BY nm.nodo_id
        `;
        oConexion.query(sql, (err, rows) => {
            if (err) return reject(err);
            // Parse payloads
            const nodeData = rows.map(row => {
                const data = JSON.parse(row.payload);
                return {
                    nodo_id: row.nodo_id,
                    temperatura: data.temperatura,
                    humedad: data.humedad
                };
            });
            resolve(nodeData);
        });
    });

    Promise.all([totalUsuarios, totalNodos, totalAlertas, latestPerNode])
        .then(([usuarios, nodos, alertas, nodeData]) => {
            const stats = { usuarios, nodos, alertas };
            res.render('admin', {
                stats,
                nodeData,
                title: "Panel Principal | SmartBee"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error al obtener estadísticas.");
        });
});


// Protegido con requireLogin para evitar acceso sin sesión
app.get('/configuracionperfil', requireLogin, (req, res) => {
    res.render('configuracionperfil', { layout: "layout-apicultor", title: "Configuración | SmartBee" });
});

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

// API para obtener datos del usuario logueado
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

app.get('/panel', (req, res) => {
    res.send('<h1>Bienvenido al Panel de SmartBee</h1>');
});


/**
 * 
 * @description ruta para registrar un nuevo usuario (vista)
 */

app.get('/admin/usuarios/nuevo', (req, res) => {
    res.render('admin-nuevos-usuarios', { title: "Registro usuarios| SmartBee" });
});


/**
 * 
 * @description ruta para registrar un nuevo usuario (backend)
 */

app.post('/admin/usuarios/registrar', (req, res) => {
    const { apellidos, estado, nombres, rol, id, comuna } = req.body;
    const clave = req.body.clave; // clave = mismo id

    if (!apellidos || !estado || !nombres || !rol || !id || !clave || !comuna) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    // Encriptar la clave antes de guardarla
    bcrypt.hash(clave, 10, (err, hashedPassword) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error al encriptar la clave' });
        }

        const sql = 'INSERT INTO usuario (id, nombre, apellido, comuna, rol, activo, clave) VALUES (?, ?, ?, ?, ?, ?, ?)';
        oConexion.query(sql, [id, nombres, apellidos, comuna, rol, estado, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Error al registrar usuario: ' + err.message });
            }
            res.json({ success: true, message: 'Usuario registrado exitosamente' });
        });
    });
});


app.get('/admin/usuarios/eliminar/:id', (req, res) => {
    const userId = req.params.id;

    const sql = 'DELETE FROM usuario WHERE id = ?';
    oConexion.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Error en la DB:", err);
            // 🔴 Redirigir con error en lugar de devolver JSON
            return res.redirect('/admin/usuarios?error=db');
        }

        if (result.affectedRows === 0) {
            // ⚠️ Usuario no encontrado
            return res.redirect('/admin/usuarios?error=notfound');
        }

        // ✅ Eliminación exitosa → redirige con query param
        res.redirect('/admin/usuarios?deleted=1');
    });
});



/**
 * 
 * @description ruta para editar un usuario (vista) 
 * @param {string} id - ID del usuario a editar
 * link : http://localhost:3000/admin/usuarios/editar/VRC
 *                             /admin/usuarios/editar/<%= usuario.id %>
 */

app.get('/admin/usuarios/editar/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT * FROM usuario WHERE id = ? LIMIT 1';
    oConexion.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).send("Error al obtener usuario: " + err.message);
        if (results.length === 0) return res.status(404).send("Usuario no encontrado");
        res.render('admin-usuarios-edicion', { usuario: results[0], title: "Editar Usuario | SmartBee" });
    });
});

app.post('/admin/usuarios/editar/:id', (req, res) => {


    const userId = req.params.id;
    const { nombres, apellidos, comuna, rol, estado } = req.body;
    if (!nombres || !apellidos || !comuna || !rol || !estado) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const sql = 'UPDATE usuario SET nombre = ?, apellido = ?, comuna = ?, rol = ? , activo = ? WHERE id = ?';
    oConexion.query(sql, [nombres, apellidos, comuna, rol, estado, userId], (
        err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error al actualizar usuario: ' + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, message: 'Usuario actualizado exitosamente' });
    });
});






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


app.post('/admin/nuevonodo', (req, res) => {
    const {
        nodo_id,
        nodo_descripcion,
        tipoNodo,   // "Colmena" o "Ambiental"
        colmena_id,
        estacion_id,
        descripcion,
        latitud,
        longitud,
        dueno
    } = req.body;

    // Normalizamos tipo
    const tipo = (tipoNodo === "Colmena") ? "COLMENA" : "AMBIENTAL";

    // 1. Insertar nodo
    const sqlNodo = "INSERT INTO nodo (id, descripcion, tipo) VALUES (?, ?, ?)";
    oConexion.query(sqlNodo, [nodo_id, nodo_descripcion, tipo], (err) => {
        if (err) {
            console.error("Error al insertar en nodo:", err);
            return res.status(500).send("Error al crear nodo");
        }

        if (tipo === "COLMENA") {
            // 2. Insertar colmena si no existe
            const sqlColmena = `
        INSERT IGNORE INTO colmena (id, descripcion, latitud, longitud, dueno)
        VALUES (?, ?, ?, ?, ?)
      `;
            oConexion.query(sqlColmena, [colmena_id, descripcion, latitud, longitud, dueno], (err) => {
                if (err) {
                    console.error("Error al insertar en colmena:", err);
                    return res.status(500).send("Error al crear colmena");
                }

                // 3. Relacion nodo-colmena
                const sqlRel = "INSERT INTO nodo_colmena (colmena_id, nodo_id) VALUES (?, ?)";
                oConexion.query(sqlRel, [colmena_id, nodo_id], (err) => {
                    if (err) {
                        console.error("Error al relacionar nodo-colmena:", err);
                        return res.status(500).send("Error en relación nodo-colmena");
                    }
                    res.redirect('/admin/nodos');
                });
            });

        } else {
            // 2. Insertar estación si no existe
            const sqlEstacion = `
        INSERT IGNORE INTO estacion (id, descripcion, latitud, longitud, dueno)
        VALUES (?, ?, ?, ?, ?)
      `;
            oConexion.query(sqlEstacion, [estacion_id, descripcion, latitud, longitud, dueno], (err) => {
                if (err) {
                    console.error("Error al insertar en estación:", err);
                    return res.status(500).send("Error al crear estación");
                }

                // 3. Relacion nodo-estacion
                const sqlRel = "INSERT INTO nodo_estacion (estacion_id, nodo_id) VALUES (?, ?)";
                oConexion.query(sqlRel, [estacion_id, nodo_id], (err) => {
                    if (err) {
                        console.error("Error al relacionar nodo-estacion:", err);
                        return res.status(500).send("Error en relación nodo-estacion");
                    }
                    res.redirect('/admin/nodos');
                });
            });
        }
    });
});


/**
 * 
 * @description Ruta para obtener los nodos de un usuario
 * ejemplos : http://localhost:3000/admin/nodos/amorales
 * en ese caso se visualizará los nodos del usuario con id "amorales"
 */
app.get('/admin/nodos/:id', (req, res) => {
    const userId = req.params.id;

    // Consulta para obtener nodos del usuario
    const sql = `
    
    SELECT n.id AS nodo_id,
       n.descripcion AS nodo_desc,
       n.tipo,
       c.id AS colmena_id,
       e.id AS estacion_id
FROM usuario u
LEFT JOIN colmena c ON c.dueno = u.id
LEFT JOIN nodo_colmena nc ON nc.colmena_id = c.id
LEFT JOIN estacion e ON e.dueno = u.id
LEFT JOIN nodo_estacion ne ON ne.estacion_id = e.id
LEFT JOIN nodo n 
       ON n.id = nc.nodo_id OR n.id = ne.nodo_id
WHERE u.id = ?;
`;

    oConexion.query(sql, [userId], (err, nodos) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener nodos: " + err.message);
        }
        res.render('admin-nodos-users', { nodos, userId, layout: "layout", title: "Nodos de Usuario | SmartBee" });
    });
});



/**
 * 
 * Vista para ver un nodo específico 
 * @param {string} nodoId - ID del nodo a ver
 * @description Ejemplo de URL: http://localhost:3000/admin/nodos/view/NODO-6FD1F27E-E80D-4723-B3FB-3D42204A0DD2
 * 
 */

app.get('/admin/nodos/view/:nodoId', (req, res) => {
    const nodoId = req.params.nodoId;

    const sql = `
        SELECT n.id AS nodo_id, n.descripcion AS nodo_desc, n.tipo,
               c.id AS colmena_id, c.descripcion AS colmena_desc,
               e.id AS estacion_id, e.descripcion AS estacion_desc,
               JSON_UNQUOTE(JSON_EXTRACT(m.payload, '$.temperatura')) AS temperatura,
               JSON_UNQUOTE(JSON_EXTRACT(m.payload, '$.humedad')) AS humedad,
               JSON_UNQUOTE(JSON_EXTRACT(m.payload, '$.peso')) AS peso,
               m.fecha AS ultima_fecha
        FROM nodo n
        LEFT JOIN nodo_colmena nc ON n.id = nc.nodo_id
        LEFT JOIN colmena c ON nc.colmena_id = c.id
        LEFT JOIN nodo_estacion ne ON n.id = ne.nodo_id
        LEFT JOIN estacion e ON ne.estacion_id = e.id
        LEFT JOIN nodo_mensaje m ON m.nodo_id = n.id
        WHERE n.id = ?
        ORDER BY m.fecha DESC
        LIMIT 1;
    `;

    oConexion.query(sql, [nodoId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener nodo: " + err.message);
        }
        if (results.length === 0) {
            return res.status(404).send("Nodo no encontrado");
        }
        res.render('admin-nodo-view', { 
            nodo: results[0], 
            layout: "layout", 
            title: "Ver Nodo | SmartBee" 
        });
    });
});



app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
