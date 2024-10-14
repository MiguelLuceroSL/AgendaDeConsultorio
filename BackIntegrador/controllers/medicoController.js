const db = require('../config/db');

exports.crearMedico = (req, res) => {
  const { nombre, especialidad, sucursal } = req.body;
  db.query('INSERT INTO Medicos (nombre, especialidad, sucursal) VALUES (?, ?, ?)', [nombre, especialidad, sucursal], (err) => {
    if (err) throw err;
    res.redirect('/medico');
  });
};