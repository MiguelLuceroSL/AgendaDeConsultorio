const db = require('../config/db');

const Profesional = {
  crear: (nombre_completo,callback) => {
    const sql = 'INSERT INTO profesional(nombre_completo) VALUES (?)';
    db.query(sql, [nombre_completo],callback);
  },
  borrar: (id, callback) => {
    const sql = 'DELETE FROM profesional WHERE id = ?';
    db.query(sql, [ id ], callback);
  },
};

module.exports = Profesional;