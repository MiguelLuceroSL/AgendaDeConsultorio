import {crearProfesionalS, profesionalBorrarS, obtenerProfesionalesS, actualizarEspecialidadS, actualizarNombreCompletoS} from "../services/profesionalService.js";


export const crearProfesionalC = async (req, res) => {
  const { nombre_completo, especialidad, matricula } = req.body;

  

  try {
    await crearProfesionalS(nombre_completo, especialidad, matricula);
    console.log("Profesional creado exitosamente.");
    res.render('admin/adminCreateSuccess', {message: 'Médico creado con éxito'});
  } catch (err) {
    console.error("Error al crear el profesional:", err);
    return res.status(500).send("Hubo un error al crear el profesional.");
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
  const { profesional_id, matricula } = req.body;
  try {
    await actualizarEspecialidadS(profesional_id, matricula);
    console.log("Matricula actualizada exitosamente.");
    res.redirect('adminUpdateMatriculaSuccess');
  } catch (err) {
    console.error("Error al actualizar la especialidad:", err);
    res.status(500).send("Hubo un error al actualizar la especialidad.");
  }
};

export const actualizarNombreCompletoC = async (req, res) => {
  const { nuevo_nombre_completo, profesional_id } = req.body;
  console.log('nuevo_nombre_completo: ',nuevo_nombre_completo)
  try {
    await actualizarNombreCompletoS(nuevo_nombre_completo, profesional_id);
    console.log("Nombre completo actualizado exitosamente.");
    res.redirect('adminUpdateNameSuccess');
  } catch (err) {
    console.error("Error al actualizar el nombre completo:", err);
    res.status(500).send("Hubo un error al actualizar el nombre completo.");
  }
};