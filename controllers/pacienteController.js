import {crearPacienteS, borrarPacienteS, obtenerPacientesVistaS } from '../services/pacienteService.js';

export const crearPaciente = async (req, res) => {
    const { nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento } = req.body;



    try {
        await crearPacienteS(nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento);
        console.log("Paciente creado exitosamente.");
        res.json({ message: "Paciente creado exitosamente" });
    } catch (err) {
        console.error("Error al crear el Paciente:", err);
        res.json("Hubo un error al crear el Paciente.");
    }
};

export const borrarPaciente = async (req, res) => {
    const { dni } = req.body;
    
    try {
        await borrarPacienteS(dni);
        console.log("Paciente borrado exitosamente.");
        res.json({ message: "Paciente borrado exitosamente" });
    } catch (err) {
        console.error("Error al borrar el paciente: ", err);
        res.json("Hubo un error al borrar el paciente.")
    }

}


export const obtenerPacientesVistaC = async (req, res) => {
    try {
        console.log("entramos al controlador de pacientes")
      const pacientes = await obtenerPacientesVistaS();
      console.log("🚀 ~ obtenerPacientesVistaC ~ profesionales:", profesionales)
      
      res.render('secretaria/secretariaGestionTurno', {pacientes});
    } catch (err) {
      console.error('Error al obtener los pacientes:', err);
      res.status(500).json({ message: 'Hubo un error al obtener los pacientes.' });
    }
  };