import express from 'express';
const router = express.Router();
import {crearProfesionalC, borrarProfesionalEspecialidadC, obtenerProfesionalesC, actualizarEspecialidadC, buscarProfesionalesC, buscarProfesionalesParaAgendasC, obtenerEspecialidadesC} from '../controllers/profesionalController.js';
import { obtenerProfesionalesVistaC } from '../controllers/turnoController.js';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';

router.post('/crear', crearProfesionalC);
router.delete('/borrar', borrarProfesionalEspecialidadC);
router.get('/listar', obtenerProfesionalesC);
router.get('/listar2', obtenerProfesionalesVistaC);
router.get('/buscar', authRequired, buscarProfesionalesC); // Para crear TURNOS (solo con agendas)
router.get('/buscar-para-agendas', authRequired, buscarProfesionalesParaAgendasC); // Para crear AGENDAS (todos)
router.get('/especialidades', obtenerEspecialidadesC); // Público - usado en filtros de turnos

export default router;