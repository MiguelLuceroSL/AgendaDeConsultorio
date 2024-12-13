import express from 'express';
const router = express.Router();
import { crearPaciente, borrarPaciente, obtenerPacientesVistaC } from '../controllers/pacienteController.js';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';
import { funcion2 } from '../middlewares/middle2.js';

router.post('/paciente', funcion2, authRequired, verifyRol('paciente'), (req, res) => {
  const datosPaciente = req.body.datosPaciente;

  if (!datosPaciente) {
    return res.status(400).send('No se enviaron datos del paciente');
  }

  // Renderiza la vista con los datos del paciente
  res.render('paciente/paciente', { user: datosPaciente });
});

router.get('/turno', funcion2, authRequired, verifyRol('paciente'), (req, res) => {
  res.render('paciente/pacienteTurno');
});

router.get('/perfil', funcion2, authRequired, verifyRol('paciente'), (req, res) => {
  res.render('paciente/pacientePerfil');
});

router.post('/crear', crearPaciente);
router.delete('/borrar', borrarPaciente);
router.get('/listar', obtenerPacientesVistaC)



export default router;