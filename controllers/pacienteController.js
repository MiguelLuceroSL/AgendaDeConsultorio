import { crearPacienteS, borrarPacienteS, obtenerPacientesVistaS, pacienteByUserIdS, updateFotoS, buscarPacientesS, obtenerTurnosPorPacienteIdS, pacienteIdByUserIdS, obtenerHistorialTurnosPorPacienteIdS, updatePacienteS } from '../services/pacienteService.js';
import { obtenerProfesionalesVistaS } from '../services/profesionalService.js';

export const crearPaciente = async (req, res) => {
    const { nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, icon } = req.body;
    try {
        await crearPacienteS(nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, fotocopia_documento, icon);
        res.json({ message: "Paciente creado exitosamente" });
    } catch (err) {
        console.error("Error al crear el paciente:", err);
        res.json("Hubo un error al crear el Paciente.");
    }
};

export const borrarPaciente = async (req, res) => {
    const { dni } = req.body;
    try {
        await borrarPacienteS(dni);
        res.json({ message: "Paciente borrado exitosamente" });
    } catch (err) {
        console.error("Error al borrar el paciente:", err);
        res.json("Hubo un error al borrar el paciente.")
    }
};

export const obtenerPacientesVistaC = async (req, res) => {
    try {
        const pacientes = await obtenerPacientesVistaS();
        res.render('secretaria/secretariaGestionTurno', { pacientes });
    } catch (err) {
        console.error("Error al obtener los pacientes:", err);
        res.status(500).json({ message: 'Hubo un error al obtener los pacientes.' });
    }
};

export const obtenerPacienteDniC = async (req, res) => {
    const { dni } = req.body;
    try {
        const pacienteDni = await obtenerPacienteDniS(dni);
        res.render('pacientes/perfil', { pacienteDni });
    } catch (err) {
        console.error("Error al obtener el paciente por DNI:", err);
        res.status(500).json({ message: 'Hubo un error al obtener los pacientes.' });
    }
};

export const pacienteByUserIdC = async (req, res) => {
    const id = req.res.req.user.id;
    try {
        const paciente = await pacienteByUserIdS(id); //id es pero de usuario
        const pacienteIdArray = await pacienteIdByUserIdS(id); //con id usuario recuperamos id paciente
        const pacienteId = pacienteIdArray[0].id; //como viene en un array, la extraigo
        const turnos = await obtenerTurnosPorPacienteIdS(pacienteId);
        const turnosFormateados = turnos.map(t => {
            const d = new Date(t.fecha);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const anio = d.getFullYear();

            return {
                ...t,
                fecha: `${dia}/${mes}/${anio}`
            };
        });
        res.render('paciente/paciente', { paciente, turnos: turnosFormateados });
    } catch (error) {
        console.error("Error al obtener el paciente por ID de usuario:", error);
        res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
    }
};

export const historialTurnosByUserIdC = async (req, res) => {
    const id = req.res.req.user.id;
    try {
        const paciente = await pacienteByUserIdS(id); //id es pero de usuario
        const pacienteIdArray = await pacienteIdByUserIdS(id); //con id usuario recuperamos id paciente
        const pacienteId = pacienteIdArray[0].id; //como viene en un array, la extraigo
        const turnos = await obtenerHistorialTurnosPorPacienteIdS(pacienteId);
        const turnosFormateados = turnos.map(t => {
            const d = new Date(t.fecha);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const anio = d.getFullYear();

            return {
                ...t,
                fecha: `${dia}/${mes}/${anio}`
            };
        });
        res.render('paciente/pacienteHistorialTurnos', { paciente, turnos: turnosFormateados });
    } catch (error) {
        console.error("Error al obtener el paciente por ID de usuario:", error);
        res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
    }
};

export const pacienteByUserIdTurnoC = async (req, res) => {
    //TURNOS GET
    const id = req.res.req.user.id;
    let idPaciente = 0;
    const msg = req.query.msg;
    try {
        const profesionales = await obtenerProfesionalesVistaS();
        const paciente = await pacienteByUserIdS(id)
        idPaciente = paciente[0].id;
        res.render('paciente/pacienteTurno', { idPaciente, paciente, profesionales, msg });
    } catch (error) {
        console.error("Error al obtener el paciente por ID de usuario:", error);
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
        console.error("Error al obtener el paciente por ID de usuario:", error);
        res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
    }
};

export const pacienteEditadoC = async (req, res) => {
    console.log('¡PACIENTE TRATANDO DE SER EDITADO!');
};

export const pacienteEditarC = async (req, res) => {
    //EDITAR GET
    const id = req.res.req.user.id;
    const msg = req.query.msg;
    console.log("Mensaje recibido en pacienteEditarC:", msg);
    try {
        const paciente = await pacienteByUserIdS(id)
        const date = new Date(paciente[0].fecha_nacimiento);
        const formattedDate = date.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        const fechaISO = paciente[0].fecha_nacimiento; 
        const fechaFormateada = fechaISO.toISOString().split('T')[0];
        console.log("paciente editarC paciente:", paciente);
        res.render('paciente/pacienteEditar', { paciente, formattedDate, msg, fechaFormateada });
    } catch (error) {
        console.error("Error al obtener el paciente por ID de usuario:", error);
        res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
    }
};

export const updatePacienteC = async (req, res) => {
    //EDITAR POST
    const { nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento } = req.body;
    console.log("datos obtenidos", nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento);
    console.log("Reqbody edit paciente: ", req.body);
    try {
        await updatePacienteS(nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento);
        return res.redirect("/pacientes/editar?msg=ok");
    } catch (err) {
        console.error("Error al editar el paciente:", err);
        res.json("Hubo un error al editar el Paciente.");
    }
};

export const updateFotoC = async (req, res) => {
    const { dni, icon } = req.body;
    try {
        await updateFotoS(dni, icon);
        return res.redirect("/pacientes/foto?msg=ok");
    } catch (err) {
        console.error("Error al editar la foto:", err);
        res.json("Hubo un error al editar la foto.");
    }
};

export const getFotoC = async (req, res) => {
    //FOTO GET
    const id = req.res.req.user.id;
    const msg = req.query.msg;
    try {
        const paciente = await pacienteByUserIdS(id);
        const dni = paciente[0].dni
        const icon = paciente[0].icon
        res.render('paciente/pacienteEditarFoto', { dni, icon, msg });
    } catch (error) {
        console.error("Error al obtener el paciente por ID de usuario:", error);
        res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
    }
};

export const buscarPacientesC = async (req, res) => {
    const { texto } = req.query;
    try {
        const pacientes = await buscarPacientesS(texto || '');
        res.json(pacientes);
    } catch (error) {
        console.error("Error al buscar pacientes:", error);
        res.status(500).json({ error: 'Error al buscar pacientes' });
    }
};