import express from 'express';
const router = express.Router();
import { crearPaciente, borrarPaciente, obtenerPacientesVistaC } from '../controllers/pacienteController.js';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';
import { funcion2 } from '../middlewares/middle2.js';

router.get('/paciente', funcion2, authRequired, verifyRol('paciente'), (req, res) => {
  res.render('paciente/paciente');
});

router.get('/turno', funcion2, authRequired, verifyRol('paciente'), (req, res) => {
  res.render('paciente/pacienteTurno');
});

router.post('/crear', crearPaciente);
router.delete('/borrar', borrarPaciente);
router.get('/listar',obtenerPacientesVistaC )

export default router;