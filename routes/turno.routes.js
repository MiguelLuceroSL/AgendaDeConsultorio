import express from 'express';
import {crearTurnoC, selTurnoC,borrarTurnoC, actualizarTurnoC ,confTurnoC, obtenerProfesionalesVistaC, traerTurnosC, getTurnosOcupadosController} from '../controllers/turnoController.js';

const router = express.Router()

router.post('/crear', crearTurnoC);
router.get('/secretaria/secretariaTurnoSuccess', (req, res) => {
    res.render('secretaria/secretariaTurnoSuccess')
})

router.get('/buscar', selTurnoC);

router.delete('/borrar/:id', borrarTurnoC);

router.put('/actualizar', actualizarTurnoC);

router.put('/confirmar', confTurnoC);

router.get('/horarios/ocupados', getTurnosOcupadosController);

//router.get('/listarProfesionales', obtenerProfesionalesVistaC);

//router.get('/gestionTurno', obtenerProfesionalesVistaC);

router.get('/listarTurnos', traerTurnosC)



export default router;