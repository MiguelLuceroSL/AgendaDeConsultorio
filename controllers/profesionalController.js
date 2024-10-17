const profesionalService = require('../services/profesionalService');

exports.crearProfesional = async (req, res) => {
  const { nombre_completo, matricula } = req.body;

  console.log("Datos recibidos:", { nombre_completo, matricula });

  try {
    await profesionalService.crearProfesional(nombre_completo, matricula);
    console.log("Profesional creado exitosamente");
    res.status(200).send("Profesional creado exitosamente");
  } catch (err) {
    console.error("Error al crear el profesional:", err);
    res.status(500).send("Hubo un error al crear el profesional.");
  }
};