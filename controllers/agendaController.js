import { crearAgendaS, obtenerAgendaS, actulizarAgendaS , borrarAgendaS  } from "../services/agendaService" 



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


export const obtenerAgendas = async (req, res) => {
  
  try {
    const agendas = await obtenerAgendasS();
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

