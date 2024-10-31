import express from 'express';
const router = express.Router();
import {crearPaciente, borrarPaciente } from '../controllers/pacienteController.js';
import validateToken from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';

router.get('/paciente', validateToken, verifyRol(['paciente']), (req, res) => {
    console.log("1- get /paciente pacientesRoutes.js")
    console.log("REQ DEL PACIENTES ROUTES: ",req.headers.authorization)
    res.render('paciente'); // Renderiza la vista 'paciente.pug'
  });

router.post('/crear', crearPaciente);
router.delete('/borrar', borrarPaciente);

export default router;