import e from "express";
import {crearProfesionalS, profesionalBorrarS, obtenerProfesionalesS, actualizarEspecialidadS, obtenerProfesionalesVistaS, actualizarMatriculaS, cargarProfesionalEspecialidadS, obtenerIdPorDniS, obtenerEspecialidadPorNombreS, buscarProfesionalesS, obtenerEspecialidadesS} from "../services/profesionalService.js";


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

export const crearProfesionalC = async (req, res) => {
  const { dni, nombre, apellido, fecha_nacimiento, telefono, email, domicilio_personal, especialidad, matricula } = req.body;
  
  try {
    await crearProfesionalS(dni, nombre, apellido, fecha_nacimiento, telefono, email, domicilio_personal, especialidad, matricula);
    console.log("Profesional y especialidad procesados exitosamente.");
    res.render('admin/adminCreateSuccess', {
      message: 'Médico y especialidad procesados con éxito. Si el DNI ya existía, se agregó la nueva especialidad.'
    });
  } catch (err) {
    console.error("Error al crear el profesional:", err);
    
    // Si el error tiene status 400, es un error de validación controlado
    if (err.status === 400) {
      return res.status(400).render('admin/adminCreateProfesional', {
        error: err.message
      });
    }
    
    return res.status(500).send("Hubo un error al crear el profesional: " + err.message);
  }
};

export const borrarProfesionalC = async (req, res) => {
  const { id } = req.body;
  
  try {
    await profesionalBorrarS(id);
    console.log("Se cambio el estado del profesional exitosamente.");
    res.redirect('adminDeleteSuccess');
  } catch (err) {
    console.error("Error al cambiar el estado del profesional: ", err);
    res.status(500).send("Hubo un error al cambiar el estado del profesional.");
  }
};

export const obtenerProfesionalesC = async (req, res) => {
  const especialidad = req.query.especialidad;
  try {
    const profesionales = await obtenerProfesionalesS(especialidad);
    console.log('Profesionales con estado:', profesionales);
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
    res.redirect('adminUpdateEspecialidadSuccess');
  } catch (err) {
    console.error("Error al actualizar la especialidad:", err);
    res.status(500).send("Hubo un error al actualizar la especialidad.");
  }
};

export const actualizarMatriculaC = async (req, res) => {
  const {matricula, nueva_matricula } = req.body;
  try {
    console.log("matricula controller: ", matricula);
    console.log("nueva_matricula controller: ", nueva_matricula);
    await actualizarMatriculaS(matricula, nueva_matricula);
    console.log("Matricula actualizada exitosamente.");
    res.redirect('adminUpdateMatriculaSuccess');
  } catch (err) {
    console.error("Error al actualizar la especialidad:", err);
    res.status(500).send("Hubo un error al actualizar la especialidad.");
  }
};
// Buscar profesionales dinámicamente (API endpoint para AJAX)
export const buscarProfesionalesC = async (req, res) => {
  const { texto, especialidadId } = req.query;
  const sucursalId = req.user?.sucursal_id; // Obtener sucursal del usuario logueado
  
  try {
    const profesionales = await buscarProfesionalesS(texto, especialidadId, sucursalId);
    res.json(profesionales);
  } catch (err) {
    console.error('Error al buscar profesionales:', err);
    res.status(500).json({ error: 'Error al buscar profesionales' });
  }
};

// Obtener todas las especialidades (API endpoint para AJAX)
export const obtenerEspecialidadesC = async (req, res) => {
  try {
    const especialidades = await obtenerEspecialidadesS();
    res.json(especialidades);
  } catch (err) {
    console.error('Error al obtener especialidades:', err);
    res.status(500).json({ error: 'Error al obtener especialidades' });
  }
};
