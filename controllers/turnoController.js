import { crearTurnoS, selTurnoS, borrarTurnoS, actualizarTurnoS, confTurnoS, traerTurnosS,getTurnosOcupadosService} from '../services/turnoService.js';
import {obtenerProfesionalesS, obtenerProfesionalesVistaS} from "../services/profesionalService.js";
import { obtenerPacientesVistaS } from '../services/pacienteService.js';


export const crearTurnoC = async (req, res) => {
    console.log(req.body);
    const { paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora } = req.body;
    const estado = "Confirmado"; 
  
    try {
      await crearTurnoS(paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado);
      res.redirect('secretaria/secretariaTurnoSuccess');
    } catch (err) {
      console.error('Error al crear turno:', err.message);
      res.status(500).json({ message: err.message });
    }
};

export const selTurnoC = async (req,res) => {
    const {nombre_completo} = req.query

    try {
        const turnos = await selTurnoS(nombre_completo)
        res.json(turnos)
    } catch (err) {
        console.error('Error al obtener turnos del paciente: ', err)
        res.status(500).json({message: 'Hubo un error al obtener los turnos del paciente'})
    }
}


export const borrarTurnoC = async (req,res) => {
    const {id} = req.params

    try {
        await borrarTurnoS(id)
        res.json({message: 'Turno eliminado exitosamente'})
    } catch (error) {
        console.error('Error al eliminar turno', error)
        res.status(500).json({message: 'Hubo un error al eliminar el turno'})
    }
}


export const actualizarTurnoC = async (req, res) =>{
    const {fecha, hora, estado, id} = req.body

    try {
        await actualizarTurnoS(fecha, hora, estado, id)
        res.json({ message: 'Turno actualizado exitosamente' })
    } catch (err) {
        console.error('Error al actualizar turno: ',err)
        res.status(500).json({ message: 'Hubo un error al actualizar el turno' })
    }
}

export const confTurnoC = async (req, res) =>{
    const{confirmado, id} = req.body
    
    try {
        await confTurnoS(confirmado, id)
        res.json({ message: 'Confirmación de turno actualizada exitosamente' });
    } catch (err) {
        console.error('Error al confirmar turno:', err)
        res.status(500).json({ message: 'Hubo un error al confirmar el turno' })
    }
}


export const obtenerProfesionalesVistaC = async (req, res) => {
    try {
      const profesionales = await obtenerProfesionalesVistaS();
      const pacientes = await obtenerPacientesVistaS()
      //const horarios = await traerTurnosPorFechaS()
      res.render('secretaria/secretariaGestionTurno', {profesionales, pacientes});
    } catch (err) {
      console.error('Error al obtener los profesionales:', err);
      res.status(500).json({ message: 'Hubo un error al obtener los profesionales.' });
    }
  };


  export const traerTurnosC = async (req,res) => {
    try {
        const turnos = await traerTurnosS()
        turnos.forEach(turno => {
            const date = new Date(turno.fecha);
            turno.fecha = date.toLocaleDateString('en-GB'); 
        });
        res.render('secretaria/secretariaPanel', { turnos })
    } catch (err) {
        console.error('Error al obtener Turnos: ', err)
        res.status(500).json({message: 'Hubo un error al obtener Turnos'})
    }
}


export const getTurnosOcupadosController = async (req, res) => {
  try {
    const { profesionalId, fecha } = req.query;
    const horariosOcupados = await getTurnosOcupadosService(profesionalId, fecha);
    res.json(horariosOcupados);
  } catch (err) {
    console.error('Error al obtener turnos ocupados:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//secretariaPanel

