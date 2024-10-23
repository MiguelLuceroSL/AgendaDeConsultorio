const pacienteService = require('../services/pacienteService');

exports.crearPaciente = async (req, res) => {
    const { nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, usuario_id } = req.body;

    console.log("Datos recibidos:", { nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, usuario_id });

    try {
        await pacienteService.crearPaciente(nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, usuario_id);
        console.log("Paciente creado exitosamente.");
        res.status(200).send("Paciente creado exitosamente.");
    } catch (err) {
        console.error("Error al crear el Paciente:", err);
        res.status(500).send("Hubo un error al crear el Paciente.");
    }
};

exports.borrarPaciente = async (req, res) => {
    const { dni } = req.body;
    console.log("DNI Recibido: " + dni);
    try {
        await pacienteService.borrarPaciente(dni);
        console.log("Paciente borrado exitosamente.");
        res.status(200).send("Paciente borrado exitosamente.")
    } catch (err) {
        console.error("Error al borrar el paciente: ", err);
        res.status(500).send("Hubo un error al borrar el paciente.")
    }

}