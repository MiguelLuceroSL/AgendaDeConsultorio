import express from 'express';
import {crearTurnoC, selTurnoC,borrarTurnoC, actualizarTurnoC ,confTurnoC, obtenerProfesionalesVistaC, traerTurnosPorFechaC} from '../controllers/turnoController.js';

const router = express.Router()

router.post('/crear', crearTurnoC);

router.get('/buscar', selTurnoC);

router.delete('/borrar/:id', borrarTurnoC);

router.put('/actualizar', actualizarTurnoC);

router.put('/confirmar', confTurnoC);

router.get('/listarProfesionales', obtenerProfesionalesVistaC);

router.get('/turnosDisponibles/:fecha', traerTurnosPorFechaC)

export default router;