import express from 'express';
const router = express.Router();
import {crearProfesionalC, borrarProfesionalC, obtenerProfesionalesC, actualizarEspecialidadC, buscarProfesionalesC, obtenerEspecialidadesC} from '../controllers/profesionalController.js';
import { obtenerProfesionalesVistaC } from '../controllers/turnoController.js';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';

router.post('/crear', crearProfesionalC);
router.delete('/borrar', borrarProfesionalC);
router.get('/listar', obtenerProfesionalesC);
router.get('/listar2', obtenerProfesionalesVistaC);
router.get('/buscar', authRequired, buscarProfesionalesC);
router.get('/especialidades', authRequired, obtenerEspecialidadesC);

export default router;