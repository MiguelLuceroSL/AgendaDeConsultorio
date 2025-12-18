import e from "express";
import {crearProfesionalS, profesionalEspecialidadBorrarS, obtenerProfesionalesS, actualizarEspecialidadS, obtenerProfesionalesVistaS, actualizarMatriculaS, cargarProfesionalEspecialidadS, obtenerIdPorDniS, obtenerEspecialidadPorNombreS, buscarProfesionalesS, obtenerEspecialidadesS, marcarTurnosPorReasignarS, verificarTurnosPendientesS, eliminarAgendasProfesionalEspecialidadS} from "../services/profesionalService.js";


/*export const crearProfesionalC = async (req, res) => {
  const { dni, nombre, apellido, fecha_nacimiento, telefono, email, domicilio_personal, especialidad, matricula } = req.body;
  
  try {
    const idObtenido = await obtenerIdPorDniS(dni);
    const especialidadObtenida = await obtenerEspecialidadPorNombreS(especialidad);
    if (idObtenido && idObtenido.length > 0) {
      await cargarProfesionalEspecialidadS(idObtenido[0].id, especialidadObtenida[0].id, matricula);
      console.log("Profesional ya existente, se agregó la especialidad.");
      return res.render('admin/adminCreateSuccess', {message: 'Médico ya existente, se agregó la especialidad seleccionada al DNI ingresado'});
    } else {
      await crearProfesionalS(dni, nombre, apellido, fecha_nacimiento, telefono, email, domicilio_personal, especialidad, matricula);
      console.log("Profesional creado exitosamente.");
      res.render('admin/adminCreateSuccess', {message: 'Médico creado con éxito'});
    }
  } catch (err) {
    console.error("Error al crear el profesional:", err);
    return res.status(500).send("Hubo un error al crear el profesional o cargarle una especialidad.");
  }
};*/

export const createProfesionalC = async (req, res) => {
    //create profesional GET
    const msg = req.query.msg;
    try {
        res.render('admin/adminCreateProfesional', { msg });
    } catch (error) {
        console.error("Error al obtener crear profesional:", error);
        res.status(500).json({ message: 'Hubo un error al obtener crear profesional.' });
    }
};

export const crearProfesionalC = async (req, res) => {
  //create profesional POST
  const { dni, nombre, apellido, fecha_nacimiento, telefono, email, domicilio_personal, especialidad, matricula } = req.body;
  
  try {
    await crearProfesionalS(dni, nombre, apellido, fecha_nacimiento, telefono, email, domicilio_personal, especialidad, matricula);
    return res.redirect("/admin/createProfesional?msg=ok");
  } catch (err) {
    console.error("Error al crear el profesional:", err);
    
    //si el error tiene status 400 es un error de validacion controlado
    if (err.status === 400) {
      return res.status(400).render('admin/adminCreateProfesional', {
        error: err.message
      });
    }
    
    return res.status(500).send("Hubo un error al crear el profesional: " + err.message);
  }
};

export const borrarProfesionalEspecialidadC = async (req, res) => {
  const { profesionalEspecialidadId, confirmar } = req.body;
  
  if (!profesionalEspecialidadId) {
    return res.status(400).json({ success: false, message: 'No se proporcionó el ID de la especialidad del profesional' });
  }
  
  try {
    //primero verificamos si tiene turnos pendientes antes de cambiar estado
    const verificacion = await verificarTurnosPendientesS(profesionalEspecialidadId);
    
    //cambiamos estado de la especialidad del profesional
    const resultado = await profesionalEspecialidadBorrarS(profesionalEspecialidadId);
    
    //si se dio de baja 1 a 0
    if (resultado.estadoAnterior === 1 && resultado.nuevoEstado === 0) {
      //marcamos turnos pendientes como "Por reasignar" si se confirmo
      if (confirmar === 'true' && verificacion.tieneTurnosPendientes) {
        await marcarTurnosPorReasignarS(profesionalEspecialidadId);
      }
      
      //eliminamos todas las agendas de esta especialidad
      await eliminarAgendasProfesionalEspecialidadS(profesionalEspecialidadId);
      
      return res.json({ success: true, message: 'Especialidad desactivada correctamente' });
    } else {
      return res.json({ success: true, message: 'Especialidad activada correctamente' });
    }
  } catch (err) {
    console.error("Error al cambiar el estado de la especialidad: ", err);
    res.status(500).json({ success: false, message: 'Hubo un error al cambiar el estado de la especialidad' });
  }
};

export const obtenerProfesionalesC = async (req, res) => {
  const especialidad = req.query.especialidad;
  console.log("especialidad en controller req query", req.query);
  try {
    const profesionales = await obtenerProfesionalesS(especialidad);
    

    const acceptHeader = req.headers.accept || '';
    const isJsonRequest = req.xhr || 
                         acceptHeader.includes('application/json') || 
                         (acceptHeader && !acceptHeader.includes('text/html') && !acceptHeader.includes('*/*'));
    
    if (isJsonRequest) {
      return res.json(profesionales);
    }
    
    res.render('admin/adminReadProfesional', { profesionales, especialidad });
  } catch (err) {
    console.error('Error al obtener los profesionales:', err);
    res.status(500).json({ message: 'Hubo un error al obtener los profesionales.' });
  }
};

export const actualizarEspecialidadC = async (req, res) => {
  const { matricula, especialidad } = req.body;
  try {
    await actualizarEspecialidadS(matricula, especialidad);
    console.log("Especialidad actualizada exitosamente.");
    
    
    if (req.headers['content-type'] === 'application/json') {
      return res.json({ success: true, message: 'Especialidad actualizada correctamente' });
    }

    return res.redirect("/admin/updateProfesional?msg=ok");
  } catch (err) {
    console.error("Error al actualizar la especialidad:", err);
    
    if (req.headers['content-type'] === 'application/json') {
      return res.status(500).json({ success: false, message: 'Error al actualizar la especialidad' });
    }
    
    res.status(500).send("Hubo un error al actualizar la especialidad.");
  }
};

export const actualizarMatriculaC = async (req, res) => {
  const {matricula, nueva_matricula } = req.body;
  try {
    await actualizarMatriculaS(matricula, nueva_matricula);
    console.log("Matricula actualizada exitosamente.");
    
    
    if (req.headers['content-type'] === 'application/json') {
      return res.json({ success: true, message: 'Matrícula actualizada correctamente' });
    }
    
    res.redirect('adminUpdateMatriculaSuccess');
  } catch (err) {
    console.error("Error al actualizar la matrícula:", err);
    
    if (req.headers['content-type'] === 'application/json') {
      return res.status(500).json({ success: false, message: 'Error al actualizar la matrícula' });
    }
    
    res.status(500).send("Hubo un error al actualizar la matrícula.");
  }
};

export const buscarProfesionalesC = async (req, res) => {
  const { texto, especialidadId, sucursalId } = req.query;
  
  //si el usuario es secretaria, usar su sucursal
  //si es paciente, la sucursal y especialidad son OBLIGATORIAS
  let sucursalFinal = null;
  let especialidadFinal = especialidadId;
  
  if (req.user?.rol === 'secretaria') {
    sucursalFinal = req.user.sucursal_id; //las secretarias solo ven su sucursal
  } else if (req.user?.rol === 'paciente') {
    //para pacientes, sucursal y especialidad son OBLIGATORIAS
    if (!sucursalId || !especialidadId) {
      return res.status(400).json({ error: 'Sucursal y especialidad son obligatorias' });
    }
    sucursalFinal = sucursalId;
  } else {
    //para otros roles (admin), usar lo que envien
    sucursalFinal = sucursalId || null;
  }
  
  try {
    //soloConAgendas = true para crear turnos
    const profesionales = await buscarProfesionalesS(texto, especialidadFinal, sucursalFinal, true);
    res.json(profesionales);
  } catch (err) {
    console.error('Error al buscar profesionales:', err);
    res.status(500).json({ error: 'Error al buscar profesionales' });
  }
};

//buscamos profesionales para crear AGENDAS.. todos los profesionales activos
export const buscarProfesionalesParaAgendasC = async (req, res) => {
  const { texto, especialidadId } = req.query;
  //NO filtramos por sucursal para crear agendas.. queremos ver TODOS los profesionales activos
  
  try {
    //soloConAgendas = false, sucursalId = null para traer todos
    const profesionales = await buscarProfesionalesS(texto, especialidadId, null, false);
    res.json(profesionales);
  } catch (err) {
    console.error('Error al buscar profesionales para agendas:', err);
    res.status(500).json({ error: 'Error al buscar profesionales' });
  }
};

//buscamos profesional por dni para autocompletar
export const obtenerProfesionalPorDniC = async (req, res) => {
  const { dni } = req.params;
  
  try {
    const { obtenerProfesionalPorDniS } = await import('../services/profesionalService.js');
    const profesional = await obtenerProfesionalPorDniS(dni);
    
    if (!profesional) {
      return res.status(404).json({ found: false, message: 'Profesional no encontrado' });
    }
    
    res.json({ found: true, data: profesional });
  } catch (err) {
    console.error('Error al buscar profesional por DNI:', err);
    res.status(500).json({ error: 'Error al buscar profesional' });
  }
};

export const obtenerEspecialidadesC = async (req, res) => {
  try {
    const especialidades = await obtenerEspecialidadesS();
    res.json(especialidades);
  } catch (err) {
    console.error('Error al obtener especialidades:', err);
    res.status(500).json({ error: 'Error al obtener especialidades' });
  }
};

//verificar turnos pendientes antes de borrar especialidad API endpoint para AJAX
export const verificarTurnosPendientesC = async (req, res) => {
  const { profesionalEspecialidadId } = req.query;
  
  try {
    const resultado = await verificarTurnosPendientesS(profesionalEspecialidadId);
    res.json(resultado);
  } catch (err) {
    console.error('Error al verificar turnos pendientes:', err);
    res.status(500).json({ error: 'Error al verificar turnos pendientes' });
  }
};

//buscamos profesionales-especialidades con autocompletado para el admin
export const buscarProfesionalEspecialidadC = async (req, res) => {
  const { texto } = req.query;
  
  try {
    //buscamos sin filtro de sucursal, sin filtro de agendas, y permitir inactivos para el admin
    const profesionales = await buscarProfesionalesS(texto, null, null, false, true);
    res.json(profesionales);
  } catch (err) {
    console.error('Error al buscar profesional-especialidad:', err);
    res.status(500).json({ error: 'Error al buscar' });
  }
};

//alias para compatibilidad con rutas existentes
export const borrarProfesionalC = borrarProfesionalEspecialidadC;