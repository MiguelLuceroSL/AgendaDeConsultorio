import express from 'express';
const router = express.Router();
import {crearProfesionalC, crearProfesionalEspecialidadC, borrarProfesionalC} from '../controllers/profesionalController.js';

router.post('/crear', crearProfesionalC);
router.post('/crear/:especialidad_id', crearProfesionalEspecialidadC)
router.delete('/borrar', borrarProfesionalC);

export default router;