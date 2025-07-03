import express from 'express';
import {crearTurnoC, selTurnoC,borrarTurnoC, actualizarTurnoC ,confTurnoC, obtenerProfesionalesVistaC, traerTurnosC, getTurnosOcupadosController, traerTurnoPorIdC, crearTurnoPacienteC, traerTurnoPorId2C, editarEstadoTurnoC} 
from '../controllers/turnoController.js';
import multer from 'multer';
import { storage } from '../config/cloudinaryConfig.js';

const upload = multer({ storage });

const router = express.Router()

router.post('/crear', upload.single('dni_foto'), crearTurnoC);
router.post('/crearPaciente', upload.single('dni_foto'), crearTurnoPacienteC);
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

router.get('/detalles/:id', traerTurnoPorIdC);

router.get('/editarTurno/:id', traerTurnoPorId2C);

router.post('/editar/:id', editarEstadoTurnoC);

/*router.get('/secretaria/home', (req, res) => {
  res.redirect('/turnos/listarTurnos');
});*/

export default router;