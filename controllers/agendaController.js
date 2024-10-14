const db = require('../config/db');

exports.getAgendas = (req, res) => {
  const { especialidad, sucursal } = req.query;
  let sql = 'SELECT * FROM Agendas INNER JOIN Medicos ON Agendas.medico_id = Medicos.id WHERE 1 = 1';
  if (especialidad) sql += ' AND Medicos.especialidad = ?';
  if (sucursal) sql += ' AND Medicos.sucursal = ?';

  db.query(sql, [especialidad, sucursal], (err, results) => {
    if (err) throw err;
    res.render('pacienteAgenda', { agendas: results });
  });
};

exports.reservarTurno = (req, res) => {
  const { agenda_id, paciente_id } = req.body;
  db.query('INSERT INTO Turnos (agenda_id, paciente_id, estado) VALUES (?, ?, ?)', [agenda_id, paciente_id, 'Reservado'], (err) => {
    if (err) throw err;
    res.redirect('/agenda');
  });
};
