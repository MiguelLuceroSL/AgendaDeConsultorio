import db from '../config/db.js';

const Turno = {
  crear: (paciente_id,agenda_id,fecha,hora,estado,callback) => {
    const sql = 'INSERT INTO turno (paciente_id,agenda_id,fecha,hora,estado) VALUES (?,?,?,?,?)';
    db.query(sql, [paciente_id,agenda_id,fecha,hora,estado], callback);
  },
  modificar: (id,estado,callback) => {
    const sql = 'UPDATE turno SET estado = ? WHERE id = ?';
    db.query(sql, [estado, id ], callback);
  },
};

export default Turno;