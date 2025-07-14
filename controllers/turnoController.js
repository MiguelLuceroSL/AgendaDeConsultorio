import { crearTurnoS, selTurnoS, borrarTurnoS, actualizarTurnoS, confTurnoS, traerTurnosS, getTurnosOcupadosService, traerTurnosFiltradosS, traerTurnoPorIdS, actualizarEstadoTurnoS } from '../services/turnoService.js';
import { obtenerProfesionalesS, obtenerProfesionalesVistaS } from "../services/profesionalService.js";
import { obtenerPacientesVistaS } from '../services/pacienteService.js';
import { obtenerTodasLasSucursales } from '../models/turnoModel.js';


export const crearTurnoC = async (req, res) => {
  console.log(req.body);
  const { paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora } = req.body;
  const estado = "Confirmado";
  const dniFotoUrl = req.file ? req.file.path : null; //obtener la ruta de la foto del DNI si se subió 

  try {
    await crearTurnoS(paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado, dniFotoUrl);
    res.redirect('secretaria/secretariaTurnoSuccess');
  } catch (err) {
    console.error('Error al crear turno:', err.message);
    res.status(500).json({ message: err.message });
  }
};

export const crearTurnoPacienteC = async (req, res) => {
  const { paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora } = req.body;
  const estado = "Reservada";
  const dniFotoUrl = req.file ? req.file.path : null; //obtener la ruta de la foto del DNI si se subió 

  try {
    await crearTurnoS(paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado, dniFotoUrl);
    res.render('paciente/pacienteTurnoSuccess');
  } catch (err) {
    console.error('Error al crear turno:', err.message);
    res.status(500).json({ message: err.message });
  }
};

export const selTurnoC = async (req, res) => {
  const { nombre_completo } = req.query

  try {
    const turnos = await selTurnoS(nombre_completo)
    res.json(turnos)
  } catch (err) {
    console.error('Error al obtener turnos del paciente: ', err)
    res.status(500).json({ message: 'Hubo un error al obtener los turnos del paciente' })
  }
}


export const borrarTurnoC = async (req, res) => {
  const { id } = req.params

  try {
    await borrarTurnoS(id)
    res.json({ message: 'Turno eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar turno', error)
    res.status(500).json({ message: 'Hubo un error al eliminar el turno' })
  }
}


export const actualizarTurnoC = async (req, res) => {
  const { fecha, hora, estado, id } = req.body

  try {
    await actualizarTurnoS(fecha, hora, estado, id)
    res.json({ message: 'Turno actualizado exitosamente' })
  } catch (err) {
    console.error('Error al actualizar turno: ', err)
    res.status(500).json({ message: 'Hubo un error al actualizar el turno' })
  }
}

export const confTurnoC = async (req, res) => {
  const { confirmado, id } = req.body

  try {
    await confTurnoS(confirmado, id)
    res.json({ message: 'Confirmación de turno actualizada exitosamente' });
  } catch (err) {
    console.error('Error al confirmar turno:', err)
    res.status(500).json({ message: 'Hubo un error al confirmar el turno' })
  }
}


export const obtenerProfesionalesVistaC = async (req, res) => {
  try {
    const profesionales = await obtenerProfesionalesVistaS();
    const pacientes = await obtenerPacientesVistaS()

    console.log('Profesionales:', profesionales?.length);
    console.log('Pacientes:', pacientes?.length);
    //const horarios = await traerTurnosPorFechaS()
    res.render('secretaria/secretariaGestionTurno', { profesionales, pacientes });
  } catch (err) {
    console.error('Error al obtener los profesionales:', err);
    res.status(500).json({ message: 'Hubo un error al obtener los profesionales.' });
  }
};


/*export const traerTurnosC = async (req,res) => {
  try {
      const turnos = await traerTurnosS()
      turnos.forEach(turno => {
          const date = new Date(turno.fecha);
          turno.fecha = date.toLocaleDateString('en-GB'); 
      });
      res.render('secretaria/secretariaPanel', { turnos })
  } catch (err) {
      console.error('Error al obtener Turnos: ', err)
      res.status(500).json({message: 'Hubo un error al obtener Turnos'})
  }
}*/

export const traerTurnosC = async (req, res) => {
  try {
    const filtros = {
      sucursal: req.query.sucursal || null,
      paciente: req.query.paciente || null,
      profesional: req.query.profesional || null
    };

    const turnos = await traerTurnosFiltradosS(filtros);
    const sucursales = await obtenerTodasLasSucursales();

    turnos.forEach(t => {
      const date = new Date(t.fecha);
      t.fecha = date.toLocaleDateString('es-AR');
    });

    res.render('secretaria/secretariaTurnos', { turnos, sucursales });
  } catch (err) {
    console.error('Error al obtener Turnos:', err);
    res.status(500).json({ message: 'Hubo un error al obtener Turnos' });
  }
};



export const getTurnosOcupadosController = async (req, res) => {
  try {
    const { profesionalId, fecha } = req.query;
    const horariosOcupados = await getTurnosOcupadosService(profesionalId, fecha);
    res.json(horariosOcupados);
  } catch (err) {
    console.error('Error al obtener turnos ocupados:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const traerTurnoPorIdC = async (req, res) => {
  const id = req.params.id;
  try {
    const turno = await traerTurnoPorIdS(id);
    if (!turno) {
      return res.status(404).render('error', { message: 'Turno no encontrado' });
    }

    const fecha = new Date(turno.fecha);
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-AR', opcionesFecha);
    turno.fechaFormateada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

    turno.horaFormateada = turno.hora?.slice(0, 5) || turno.hora;

    res.render('secretaria/secretariaDetalleTurno', { turno });
  } catch (error) {
    console.error('Error al obtener los detalles del turno:', error);
    res.status(500).send('Error al cargar detalles');
  }
};

export const traerTurnoPorId2C = async (req, res) => {
  const id = req.params.id;
  try {
    const turno = await traerTurnoPorIdS(id);
    if (!turno) {
      return res.status(404).render('error', { message: 'Turno no encontrado' });
    }

    const fecha = new Date(turno.fecha);
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-AR', opcionesFecha);
    turno.fechaFormateada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

    turno.horaFormateada = turno.hora?.slice(0, 5) || turno.hora;

    res.render('secretaria/secretariaEditarTurno', { turno });
  } catch (error) {
    console.error('Error al obtener los detalles del turno:', error);
    res.status(500).send('Error al cargar detalles');
  }
};

export const obtenerTurnoYMedicosC = async (req, res) => {
  const id = req.params.id;
  try {
    const turno = await traerTurnoPorIdS(id);
    const profesionales = await obtenerProfesionalesVistaS();
    console.log('Turno:', turno);
    console.log('Profesionales:', profesionales);
    if (!turno) {
      return res.status(404).render('error', { message: 'Turno no encontrado' });
    }

    res.render('secretaria/secretariaTrasladar', { turno, profesionales });
  } catch (error) {
    console.error('Error al preparar traslado del turno:', error);
    res.status(500).send('Error al preparar traslado');
  }
};

export const editarEstadoTurnoC = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const estadosValidos = ['No disponible', 'Libre', 'Reservada', 'Confirmado', 'Cancelado', 'Ausente', 'Presente', 'En consulta', 'Atendido'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).send('Estado inválido');
  }
  try {
    console.log("por editar el estado en controller");
    await actualizarEstadoTurnoS(estado, id);
    console.log("estado editado correctamente");
    res.redirect('/turnos/listarTurnos'); // Redirigir a la lista de turnos después de actualizar
  } catch (err) {
    console.error('Error al actualizar estado del turno: ', err);
    res.status(500).send('Hubo un error al actualizar el estado del turno');
  }
};

//secretariaPanel

