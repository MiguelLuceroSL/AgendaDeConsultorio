const pacienteService = require('../services/pacienteService');

exports.crearPaciente = async (req, res) => {
    const { nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento } = req.body;

    console.log("Datos recibidos:", { nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento });

    try {
        await pacienteService.crearPaciente(nombre_completo,dni,obra_social,telefono,email,direccion,fecha_nacimiento);
        console.log("Paciente creado exitosamente.");
        res.status(200).send("Paciente creado exitosamente.");
    } catch (err) {
        console.error("Error al crear el Paciente:", err);
        res.status(500).send("Hubo un error al crear el Paciente.");
    }
};