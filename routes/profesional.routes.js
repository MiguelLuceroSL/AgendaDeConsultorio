import express from 'express';
const router = express.Router();
import {crearProfesionalC, borrarProfesionalC, obtenerProfesionalesC, actualizarEspecialidadC} from '../controllers/profesionalController.js';

router.post('/crear', crearProfesionalC);
router.delete('/borrar', borrarProfesionalC);
router.get('/listar', obtenerProfesionalesC);

export default router;