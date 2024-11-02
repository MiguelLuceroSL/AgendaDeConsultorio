import express from 'express';
const router = express.Router();
import { crearPaciente, borrarPaciente } from '../controllers/pacienteController.js';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';
import { funcion2 } from '../middlewares/middle2.js';

router.get('/paciente', funcion2, authRequired, verifyRol('paciente'), (req, res) => {
  console.log("1- get /paciente pacientesRoutes.js")
  res.render('paciente'); // Renderiza la vista 'paciente.pug'
});

router.post('/crear', crearPaciente);
router.delete('/borrar', borrarPaciente);

export default router;