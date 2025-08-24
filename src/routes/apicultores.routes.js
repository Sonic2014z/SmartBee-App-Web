const { Router } = require('express');
const app = Router();
//middlewares

// controlador bd
const apicultorController = require ('../db/controller/apicultor.controller');

app.get('/vistahistorica', (req, res) => {
    res.render('vistahistorica', { layout: "layout-apicultor", title: "Vista Histórica | SmartBee" });
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

module.exports = app;

