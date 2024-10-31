import {profesionalCrearS, profesionalBorrarS, crearProfesionalEspecialidadS} from "../services/profesionalService.js";

export const crearProfesionalC = async (req, res) => {
  const { nombre_completo } = req.body;

  console.log("Datos recibidos:", { nombre_completo });

  try {
    await profesionalCrearS(nombre_completo);
    console.log("Profesional creado exitosamente.");
    res.status(200).send("Profesional creado exitosamente.");
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

export const crearProfesionalEspecialidadC = async (req, res) => {
  const { nombre_completo, matricula } = req.body;
  const {especialidad_id} = req.params;
  try {
    await crearProfesionalEspecialidadS(
      nombre_completo,
      especialidad_id,
      matricula
    );
    console.log("Profesional creado exitosamente.");
    res.status(200).send("Profesional con especialidad creado exitosamente.");
  } catch (err) {
    console.error("Error al crear el profesional con especialidad:", err);
    res.status(500).send("Hubo un error al crear el profesional con especialidad.");
  }
};
