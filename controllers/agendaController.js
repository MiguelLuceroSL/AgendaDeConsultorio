import db from '../config/db.js';
import { crearAgendaS, obtenerAgendaS, actulizarAgendaS, borrarAgendaS,obtenerAgendasActivasS } from '../services/agendaService.js'; 



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
  const {horario_inicio , horario_fin, estado, id} =req.body

  try {
    await actulizarAgendaS(horario_inicio , horario_fin, estado, id)
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


export const obtenerAgendasActivasC = async (req, res) => {
  try {
    const profesionalId = req.params.profesionalId;
    const agendas = await obtenerAgendasActivasS(profesionalId);
    res.status(200).json(agendas);
  } catch (error) {
    console.error('Error en controlador Agenda:', error.message);
    res.status(500).json({ error: error.message });
  }
};

