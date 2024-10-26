const pacienteService = require('../services/pacienteService');

exports.crearPaciente = async (req, res) => {
    const { nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento } = req.body;

    console.log("Datos recibidos:", { nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento });

    try {
        await pacienteService.crearPaciente(nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento);
        console.log("Paciente creado exitosamente.");
        res.json({ message: "Paciente creado exitosamente" });
    } catch (err) {
        console.error("Error al crear el Paciente:", err);
        res.json("Hubo un error al crear el Paciente.");
    }
};

exports.borrarPaciente = async (req, res) => {
    const { dni } = req.body;
    console.log("DNI Recibido: " + dni);
    try {
        await pacienteService.borrarPaciente(dni);
        console.log("Paciente borrado exitosamente.");
        res.json({ message: "Paciente borrado exitosamente" });
    } catch (err) {
        console.error("Error al borrar el paciente: ", err);
        res.json("Hubo un error al borrar el paciente.")
    }

}