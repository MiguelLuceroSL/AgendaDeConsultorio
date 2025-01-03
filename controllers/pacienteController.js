import { crearPacienteS, borrarPacienteS, obtenerPacientesVistaS, pacienteByUserIdS } from '../services/pacienteService.js';

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

}


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
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    console.log('reqqqqqqqqq QQQQQQQQQQQQQQQQQQQQQQQQQQ', req.res.req.user.id)
    const id = req.res.req.user.id;
    try {
        console.log('entramos al pacienteByUserIdController')
        console.log('ID CONTROLLER: ', id)
        const paciente = await pacienteByUserIdS(id)
        console.log('tenemos al paciente!')
        console.log('paciente: ', paciente);
        res.render('paciente/paciente', { paciente });
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
        console.log('pacienteeeeeeD', paciente)
        res.render('paciente/pacientePerfil', { paciente, formattedDate });
    } catch (error) {
        console.error('Error al obtener el paciente: ', error);
        res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
    }
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

}