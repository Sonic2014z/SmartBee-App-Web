// ------------------------------------- //

// Consulta para obtener todos los usuarios.
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

// Consulta para obtener los nodos desde la base de datos.
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


// Consulta para obtener usuarios para asignarle a uno un nuevo nodo.
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

// Consulta para obtener los datos necesarios para el panel principal del administrados. Este contiene 3 promesas:
// 1. totalUsuarios: Este corresponde a un COUNT para contar el número de usuarios totales dentro de la base de datos.
// 2. totalNodos: Lo mismo que en "totalUsuarios", pero en este caso para el número de nodos.
// 3. totalAlertas: Mismo caso.
// 4. latestPerNode: Esta consulta corresponde a la visualización de la data más reciente de cada nodo (temperatura, humedad, peso) para su visualización en los gráficos del panel principal.
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

// Corresponde a la inserción de nuevos usuarios a la base de datos.
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

// Corresponde a la eliminación de un usuario en la base de datos.
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

// Corresponde a la obtención de los datos del usuario a editar.
app.get('/admin/usuarios/editar/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT * FROM usuario WHERE id = ? LIMIT 1';
    oConexion.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).send("Error al obtener usuario: " + err.message);
        if (results.length === 0) return res.status(404).send("Usuario no encontrado");
        res.render('admin-usuarios-edicion', { usuario: results[0], title: "Editar Usuario | SmartBee" });
    });
});

// Corresponde a la actualización de los datos del usuarios dentro de la base de datos.
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

// Corresponde a la inserción de nuevos nodos (y estaciones en el caso de que no exista) a la base de datos.
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

// Corresponde a los nodos que posee un usuario en específico.
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

// Corresponde a la información de un nodo en específico.
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