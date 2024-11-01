import express from 'express';
const router = express.Router();
import {crearProfesionalC, borrarProfesionalC} from '../controllers/profesionalController.js';

router.post('/crear', crearProfesionalC);
router.delete('/borrar', borrarProfesionalC);

export default router;