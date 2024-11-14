import {crearProfesionalS, profesionalBorrarS, obtenerProfesionalesS, actualizarEspecialidadS} from "../services/profesionalService.js";


export const crearProfesionalC = async (req, res) => {
  const { nombre_completo, especialidad, matricula } = req.body;

  console.log("Datos recibidos:", { nombre_completo, especialidad, matricula });

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
  console.log("ID Recibida: " + id);
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
  const { profesional_id, nueva_especialidad, matricula } = req.body;
  try {
    await actualizarEspecialidadS(profesional_id, nueva_especialidad, matricula);
    console.log("Especialidad actualizada exitosamente.");
    res.status(200).json({message: 'Se actualizo correctamente'})
  } catch (err) {
    console.error("Error al actualizar la especialidad:", err);
    res.status(500).send("Hubo un error al actualizar la especialidad.");
  }
};