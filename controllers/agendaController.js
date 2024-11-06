import db from '../config/db.js';

export const getAgendas = (req, res) => {
  const { especialidad, sucursal } = req.query;
  let sql = 'SELECT * FROM Agendas INNER JOIN Medicos ON Agendas.medico_id = Medicos.id WHERE 1 = 1';
  if (especialidad) sql += ' AND Medicos.especialidad = ?';
  if (sucursal) sql += ' AND Medicos.sucursal = ?';

  db.query(sql, [especialidad, sucursal], (err, results) => {
    if (err) throw err;
    res.render('pacienteAgenda', { agendas: results });
  });
};

export const reservarTurno = (req, res) => {
  const { agenda_id, paciente_id } = req.body;
  db.query('INSERT INTO Turnos (agenda_id, paciente_id, estado) VALUES (?, ?, ?)', [agenda_id, paciente_id, 'Reservado'], (err) => {
    if (err) throw err;
    res.redirect('/agenda');
  });
};







/*import { crearAgendaS, obtenerAgendaS, actulizarAgendaS, borrarAgendaS } from '../services/agendaService.js'; 



export const crearAgendaC = async (req, res) => {
  const{ profesional_especialidad_id, sucursal_id, horario_inicio, horario_fin, dia_inicio, dia_fin, estado } = req.body;

  try {
    await crearAgendaS(profesional_especialidad_id, sucursal_id, horario_inicio, horario_fin,dia_inicio, dia_fin, estado);
    res.json({ message: 'Agenda creada exitosamente.' });
  } catch (err) {
    console.error('Error al crear agenda:', err);
    res.status(500).json({ message: 'Hubo un error al crear la agenda.' });
  }
}


export const obtenerAgendasC = async (req, res) => {
  
  try {
    const agendas = await obtenerAgendaS();
    res.json(agendas);
  } catch (err) {
    console.error('Error al obtener las agendas:', err);
    res.status(500).json({ message: 'Hubo un error al obtener las agendas.' });
  }
};

export const actulizarAgendaC = async (req, res) => {
  const {id, horario_inicio , horario_fin, estado} =req.body

  try {
    await actulizarAgendaS(id,horario_inicio , horario_fin, estado)
    res.json({ message: 'Agenda Actualizada con exito'})
  } catch (err) {
    console.log('error al actulizar agenda', err)
    res.status(500).json({ message: 'Hubo un error al actulizar la agenda'})
  }
}


export const borrarAgendaC = async (req,res) => {
  const {id} = req.body

  try {
    await borrarAgendaS(id)
    res.json ({message: 'Agenda eliminada con exito'})
  } catch (err) {
    console.log('Error al eliminar agenda', err)
    res.status(500).json({ message: 'Hubo un error al eliminar la agenda'})
  }
}

*/
