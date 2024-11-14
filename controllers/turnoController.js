import { crearTurnoS, selTurnoS, borrarTurnoS, actualizarTurnoS, confTurnoS } from '../services/turnoService.js';
import {obtenerProfesionalesS, obtenerProfesionalesVistaS} from "../services/profesionalService.js";


export const crearTurnoC = async (req, res) =>{
    const{ paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado} = (req.body)

    try {
        const result = await crearTurnoS(paciente_id, profesional_especialidad_id, detalle_turno, fecha, hora, estado, confirmado)
        res.json({message: 'Turno creado con exitosamente', data: result})
    } catch (err) {
        console.error('Error al crear turno:', err)
        res.status(500).json({message: 'Hubo un error al crear el turno'})
    }
}

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
      console.log("🚀 ~ obtenerProfesionalesC ~ profesionales:", profesionales)
      res.render('secretaria/secretariaGestionTurno', {profesionales});
    } catch (err) {
      console.error('Error al obtener los profesionales:', err);
      res.status(500).json({ message: 'Hubo un error al obtener los profesionales.' });
    }
  };