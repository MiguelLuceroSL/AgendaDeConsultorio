import {crearProfesionalS, profesionalBorrarS, obtenerProfesionalesS, actualizarEspecialidadS, actualizarNombreCompletoS} from "../services/profesionalService.js";


export const crearProfesionalC = async (req, res) => {
  const { nombre_completo, especialidad, matricula } = req.body;

  

  try {
    await crearProfesionalS(nombre_completo, especialidad, matricula);
    console.log("Profesional creado exitosamente.");
    res.render('admin/adminCreateSuccess', {message: 'Médico creado con éxito'});
  } catch (err) {
    console.error("Error al crear el profesional:", err);
    res.status(500).send("Hubo un error al crear el profesional.");
  }
};

export const borrarProfesionalC = async (req, res) => {
  const { id } = req.body;
  
  try {
    await profesionalBorrarS(id);
    console.log("Profesional borrado exitosamente.");
    res.status(200).send("Profesional borrado exitosamente.");
  } catch (err) {
    console.error("Error al borrar el profesional: ", err);
    res.status(500).send("Hubo un error al borrar el profesional.");
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
  const { profesional_id, nueva_especialidad } = req.body;
  try {
    await actualizarEspecialidadS(profesional_id, nueva_especialidad);
    console.log("Especialidad actualizada exitosamente.");
    res.status(200).json({message: 'Se actualizo correctamente'})
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
    res.status(200).json({message: 'Se actualizo correctamente'});
  } catch (err) {
    console.error("Error al actualizar la especialidad:", err);
    res.status(500).send("Hubo un error al actualizar la especialidad.");
  }
};

export const actualizarNombreCompletoC = async (req, res) => {
  const { profesional_id, nuevo_nombre_completo } = req.body;
  try {
    await actualizarNombreCompletoS(profesional_id, nuevo_nombre_completo);
    console.log("Nombre completo actualizado exitosamente.");
    res.status(200).json({message: 'Se actualizo el nombre completo correctamente'})
  } catch (err) {
    console.error("Error al actualizar el nombre completo:", err);
    res.status(500).send("Hubo un error al actualizar el nombre completo.");
  }
};