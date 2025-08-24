
const mysql = require('mysql2');
const config = require('../config/config.js');

let conn;
function connMYSQL() {

    conn = mysql.createConnection(config.mysql);

    conn.connect((error) => {
        if (error) {
            console.log('[db error]', error);
            setTimeout(connMYSQL, 2000);
        } else {
            console.log('[db conectada]');
        }
    });

    conn.on('error', error => {
        console.log('[db error]', error);
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            connMYSQL();
        } else {
            throw error;
        }
    });
}
connMYSQL();

module.exports = conn

/*
const oConexion = oMySQL.createConnection({
    host: "localhost",
    database: "smartbee",
    user: "smartbee.app",
    port: 3306,
    password: "aeshae7JooG1Thah1oz5"
});

*/
