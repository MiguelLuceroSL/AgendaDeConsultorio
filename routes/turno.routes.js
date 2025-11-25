import express from 'express';
import {crearTurnoC, selTurnoC,borrarTurnoC, actualizarTurnoC ,confTurnoC, obtenerProfesionalesVistaC, traerTurnosC, getTurnosOcupadosController, traerTurnoPorIdC, crearTurnoPacienteC, traerTurnoPorId2C, editarEstadoTurnoC, obtenerTurnoYMedicosC, actualizarTurnoTrasladoC, verificarSobreturnos, obtenerHorariosPorEstadoC} 
from '../controllers/turnoController.js';
import { authRequired } from '../middlewares/validateToken.js';
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

router.get('/listarTurnos', authRequired, traerTurnosC)

router.get('/detalles/:id', authRequired, traerTurnoPorIdC);

router.get('/editarTurno/:id', authRequired, traerTurnoPorId2C);

router.post('/editar/:id', authRequired, editarEstadoTurnoC);

router.get('/trasladar/:id', authRequired, obtenerTurnoYMedicosC);

router.post('/trasladar/:id', authRequired, actualizarTurnoTrasladoC);

router.get("/horarios/estado", obtenerHorariosPorEstadoC);

router.get('/sobreturnos/verificar', verificarSobreturnos);

/*router.get('/secretaria/home', (req, res) => {
  res.redirect('/turnos/listarTurnos');
});*/

export default router;