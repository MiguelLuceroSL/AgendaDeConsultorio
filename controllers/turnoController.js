import { crearTurnoS, selTurnoS, borrarTurnoS, actualizarTurnoS, confTurnoS, traerTurnosS, getTurnosOcupadosService, traerTurnosFiltradosS, traerTurnoPorIdS, actualizarEstadoTurnoS, actualizarTurnoTrasladoS, verificarSobreturnosS, obtenerHorariosPorEstadoS, obtenerEstadosTurnoPorHorarioS, verificarCantidadSobreturnos } from '../services/turnoService.js';
import { obtenerProfesionalesS, obtenerProfesionalesVistaS } from "../services/profesionalService.js";
import { obtenerPacientesVistaS } from '../services/pacienteService.js';
import { obtenerTodasLasSucursales } from '../models/turnoModel.js';


export const crearTurnoC = async (req, res) => {
  console.log(req.body);
  let { paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, es_sobreturno } = req.body;
  console.log('Raw es_sobreturno:', req.body.es_sobreturno, typeof req.body.es_sobreturno);
  es_sobreturno = Number(req.body.es_sobreturno) === 1 ? 1 : 0;
  console.log('Parsed es_sobreturno:', es_sobreturno);
  console.log("🚀 ~ crearTurnoC ~ es_sobreturno:", es_sobreturno)
  const estado ="Confirmado";
  console.log("🚀 ~ crearTurnoC ~ estado:", estado)
  const dniFotoUrl = req.file ? req.file.path : null; //obtener la ruta de la foto del DNI si se subió 

  try {
    await crearTurnoS(paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado, dniFotoUrl, es_sobreturno);
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
    return res.redirect('../pacientes/turno?msg=ok');
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

export const actualizarTurnoTrasladoC = async (req, res) => {
  const turnoId = req.params.id;
  const { profesional_especialidad_id, fecha, hora, detalle_turno, estado } = req.body;

  try {
    await actualizarTurnoTrasladoS(fecha, hora, estado, turnoId, profesional_especialidad_id, detalle_turno)
    res.redirect(`/turnos/listarTurnos`);
  } catch (err) {
    console.error('Error al trasladar turno: ', err)
    res.status(500).json({ message: 'Hubo un error al trasladar el turno' })
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
    const sucursalId = req.user?.sucursal_id; // Obtener sucursal del usuario logueado
    const profesionales = await obtenerProfesionalesVistaS(sucursalId);
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
    const sucursalIdUsuario = req.user?.sucursal_id; // Sucursal del usuario logueado
    
    // Si es secretaria, SIEMPRE filtrar por su sucursal (no permitir cambiar)
    // Si es admin (sin sucursal_id), permitir filtrar
    const sucursalFiltro = sucursalIdUsuario || req.query.sucursal || null;
    
    const filtros = {
      sucursal_id: sucursalFiltro,
      paciente: req.query.paciente || null,
      profesional: req.query.profesional || null
    };

    const turnos = await traerTurnosFiltradosS(filtros);
    const sucursales = await obtenerTodasLasSucursales();

    turnos.forEach(t => {
      const date = new Date(t.fecha);
      t.fecha = date.toLocaleDateString('es-AR');
    });

    res.render('secretaria/secretariaTurnos', { 
      turnos, 
      sucursales,
      sucursalUsuario: sucursalIdUsuario // Pasar al template para pre-seleccionar
    });
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
    const sucursalId = req.user?.sucursal_id;
    const profesionales = await obtenerProfesionalesVistaS(sucursalId);
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
  const estadosValidos = ['No disponible', 'Libre', 'Reservada', 'Confirmado', 'Cancelado', 'Ausente', 'Presente', 'En consulta', 'Atendido', 'Por reasignar'];
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

export const obtenerHorariosPorEstadoC = async (req, res) => {
  try {
    const { profesionalId, fecha } = req.query;
    const horarios = await obtenerHorariosPorEstadoS(profesionalId, fecha);
    console.log("Horarios recibidos:", horarios);

     const normalizar = (hora) => {
      if (!hora) return null;
      return hora.slice(0, 5);
}
    console.log("horarios formateados", normalizar)

     const estadosOcultos = [
      "Confirmado",
      "No disponible",
      "Presente",
      "En consulta",
      "Atendido"
     ]
     

    const confirmados = horarios
      .filter((t) => estadosOcultos.includes(t.estado))
      .map((t) => normalizar(t.hora))
      .filter((h) => h);
      
    const reservados = horarios
      .filter((t) => t.estado === "Reservada")
      .map((t) => normalizar(t.hora))
      .filter((h) => h);

    res.json({ confirmados, reservados });
  } catch (error) {
    console.error("Error en obtenerHorariosPorEstadoC:", error);
    res.status(500).json({ error: "Error al obtener horarios" });
  }
};

export const verificarSobreturnosC = async (req, res) => {
  const { profesionalId, fecha, hora } = req.query;
  try {
    const cantidad = await verificarSobreturnosS(profesionalId, fecha, hora);
    res.json({ cantidad });
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar sobreturnos' });
  }
};

export const obtenerEstadosTurnoPorHorarioC = async (req, res) => {
  const { profesionalId, fecha } = req.query;
  try {
    const estados = await obtenerEstadosTurnoPorHorarioS(profesionalId, fecha);
    res.json(estados);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los estados' });
  }
};

export const verificarSobreturnos = async (req, res) => {
  try {
    const { profesionalId, fecha } = req.query;

    if (!profesionalId || !fecha) {
      return res.status(400).json({ error: "Faltan parámetros" });
    }

    const cantidad = await verificarCantidadSobreturnos(profesionalId, fecha);
    res.json({ cantidad: cantidad.cantidad });

  } catch (error) {
    console.error("Error al verificar sobreturnos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerTurnoParaReasignarC = async (req, res) => {
  const { id } = req.params;
  try {
    const turno = await traerTurnoPorIdS(id);
    
    if (!turno) {
      return res.status(404).send('Turno no encontrado');
    }
    
    if (turno.estado !== 'Por reasignar') {
      return res.status(400).send('Este turno no está marcado para reasignar');
    }
    
    // Formatear la fecha
    const fecha = new Date(turno.fecha);
    turno.fechaFormateada = fecha.toLocaleDateString('es-AR');
    
    // Obtener profesionales con la misma especialidad que TENGAN AGENDAS ACTIVAS
    // Usamos sucursalId para filtrar por sucursal
    const sucursalId = req.user?.sucursal_id;
    const profesionales = await obtenerProfesionalesVistaS(sucursalId);
    
    // Filtrar solo profesionales con la misma especialidad del turno y que estén activos
    const profesionalesFiltrados = profesionales.filter(p => 
      p.especialidad === turno.especialidad && p.estado === 1
    );
    
    console.log('Turno a reasignar:', { especialidad: turno.especialidad, fecha: turno.fecha });
    console.log('Profesionales disponibles con agendas:', profesionalesFiltrados);
    
    res.render('secretaria/secretariaReasignarTurno', { 
      turno, 
      profesionales: profesionalesFiltrados 
    });
  } catch (error) {
    console.error('Error al preparar reasignación:', error);
    res.status(500).send('Error al preparar reasignación');
  }
};

export const reasignarTurnoC = async (req, res) => {
  const { id } = req.params;
  const { profesional_especialidad_id, fecha, hora } = req.body;
  
  try {
    // Actualizar el turno con la nueva agenda y cambiar estado a "Confirmado"
    await actualizarTurnoTrasladoS(fecha, hora, 'Confirmado', id, profesional_especialidad_id, '');
    
    res.redirect('/turnos/listarTurnos');
  } catch (error) {
    console.error('Error al reasignar turno:', error);
    res.status(500).send('Error al reasignar turno');
  }
};

//secretariaPanel

