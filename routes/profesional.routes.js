import express from 'express';
const router = express.Router();
import {crearProfesionalC, borrarProfesionalC, obtenerProfesionalesC, actualizarEspecialidadC} from '../controllers/profesionalController.js';
import { obtenerProfesionalesVistaC } from '../controllers/turnoController.js';

router.post('/crear', crearProfesionalC);
router.delete('/borrar', borrarProfesionalC);
router.get('/listar', obtenerProfesionalesC);
router.get('/listar2', obtenerProfesionalesVistaC);



export default router;