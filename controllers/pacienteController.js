import { crearPacienteS, borrarPacienteS, obtenerPacientesVistaS, pacienteByUserIdS, updateFotoS } from '../services/pacienteService.js';
import { obtenerProfesionalesVistaS } from '../services/profesionalService.js';

export const crearPaciente = async (req, res) => {
    const { nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, icon } = req.body;
    try {
        await crearPacienteS(nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, icon);
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
};

export const obtenerPacientesVistaC = async (req, res) => {
    try {
        console.log("entramos al controlador de pacientes")
        const pacientes = await obtenerPacientesVistaS();
        console.log("🚀 ~ obtenerPacientesVistaC ~ pacientes:", pacientes)
        res.render('secretaria/secretariaGestionTurno', { pacientes });
    } catch (err) {
        console.error('Error al obtener los pacientes:', err);
        res.status(500).json({ message: 'Hubo un error al obtener los pacientes.' });
    }
};

export const obtenerPacienteDniC = async (req, res) => {
    const { dni } = req.body;
    try {
        console.log("entramos al controlador de paciente by dni")
        const pacienteDni = await obtenerPacienteDniS(dni);
        console.log("🚀 ~ obtenerPacientesVistaC ~ profesionales:", pacienteDni)
        res.render('pacientes/perfil', { pacienteDni });
    } catch (err) {
        console.error('Error al obtener los pacientes:', err);
        res.status(500).json({ message: 'Hubo un error al obtener los pacientes.' });
    }
};

export const pacienteByUserIdC = async (req, res) => {
    const id = req.res.req.user.id;
    try {
        const paciente = await pacienteByUserIdS(id)
        res.render('paciente/paciente', { paciente });
    } catch (error) {
        console.error('Error al obtener el paciente: ', error);
        res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
    }
};

export const pacienteByUserIdTurnoC = async (req, res) => {
    const id = req.res.req.user.id;
    let idPaciente = 0;
    try {
        const profesionales = await obtenerProfesionalesVistaS();
        const paciente = await pacienteByUserIdS(id)
        console.log("🚀 ~ pacienteByUserIdTurnoC ~ profesionales:", profesionales)
        console.log('Profesionales:', profesionales?.length);
        console.log("🚀 ~ pacienteByUserIdTurnoC ~ paciente:", paciente)
        console.log('paciente iddddddddddd:', paciente[0].id);
        idPaciente = paciente[0].id;
        res.render('paciente/pacienteTurno', { idPaciente, paciente, profesionales });
    } catch (error) {
        console.error('Error al obtener el paciente: ', error);
        res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
    }
};

export const pacientePerfilC = async (req, res) => {
    const id = req.res.req.user.id;
    try {
        const paciente = await pacienteByUserIdS(id)
        const date = new Date(paciente[0].fecha_nacimiento);
        const formattedDate = date.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        res.render('paciente/pacientePerfil', { paciente, formattedDate });
    } catch (error) {
        console.error('Error al obtener el paciente: ', error);
        res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
    }
};

export const pacienteEditadoC = async (req, res) => {
    console.log('¡PACIENTE TRATANDO DE SER EDITADO!');
    console.log('REQ del EDITADO: ', req);
};

export const pacienteEditarC = async (req, res) => {
    const id = req.res.req.user.id;
    try {
        const paciente = await pacienteByUserIdS(id)
        const date = new Date(paciente[0].fecha_nacimiento);
        const formattedDate = date.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        res.render('paciente/pacienteEditar', { paciente, formattedDate });
    } catch (error) {
        console.error('Error al obtener el paciente: ', error);
        res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
    }
};

export const updatePacienteC = async (req, res) => {
    console.log('REQ.BODY del Update: ', req.body);
    const { nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento } = req.body;
    try {
        await updatePacienteS(nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento);
        console.log("Paciente editado exitosamente.");
        res.json({ message: "Paciente editado exitosamente" });
    } catch (err) {
        console.error("Error al editar el Paciente:", err);
        res.json("Hubo un error al editar el Paciente.");
    }
};

export const updateFotoC = async (req, res) => {
    console.log('REQ.BODY del Update fotooooooooooooo: ', req.body);
    const { dni, icon } = req.body;
    try {
        await updateFotoS(dni, icon);
        console.log("Foto editada exitosamente.");
        res.render('paciente/pacienteEditarFotoSuccess');
    } catch (err) {
        console.error("Error al editar la foto:", err);
        res.json("Hubo un error al editar la foto.");
    }
};

export const getFotoC = async (req, res) => {
    const id = req.res.req.user.id;
    try {
        const paciente = await pacienteByUserIdS(id);
        const dni = paciente[0].dni
        const icon = paciente[0].icon
        res.render('paciente/pacienteEditarFoto', { dni, icon });
    } catch (error) {
        console.error('Error al obtener el paciente: ', error);
        res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
    }
};