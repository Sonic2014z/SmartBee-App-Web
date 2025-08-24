
const mysql = require('mysql2');
const config = require('../config/config.js');

let oConexion;
function connMYSQL() {

    oConexion = mysql.createConnection(config.mysql);

    oConexion.connect((error) => {
        if (error) {
            console.log('[db error]', error);
            setTimeout(connMYSQL, 2000);
        } else {
            console.log('[db conectada]');
        }
    });

    oConexion.on('error', error => {
        console.log('[db error]', error);
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            connMYSQL();
        } else {
            throw error;
        }
    });
}
connMYSQL();

module.exports = oConexion


