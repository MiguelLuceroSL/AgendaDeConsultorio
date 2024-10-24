const db = require('../config/db');

const Profesional = {
  crear: (nombre_completo, matricula, callback) => {
    const sql = 'INSERT INTO profesional (nombre_completo, matricula) VALUES (?, ?)';
    db.query(sql, [nombre_completo, matricula], callback);
  },
  borrar: (id, callback) => {
    const sql = 'DELETE FROM profesional WHERE id = ?';
    db.query(sql, [ id ], callback);
  },
};

module.exports = Profesional;