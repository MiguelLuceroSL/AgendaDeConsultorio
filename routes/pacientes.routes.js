import express from 'express';
const router = express.Router();
import { borrarPaciente, getFotoC, obtenerPacientesVistaC, pacienteByUserIdC, pacienteEditarC, pacientePerfilC, updateFotoC, updatePacienteC } from '../controllers/pacienteController.js';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';
import { funcion2 } from '../middlewares/middle2.js';

router.get('/paciente', funcion2, authRequired, verifyRol('paciente'), (req, res) => {
  pacienteByUserIdC(req, res);
});

router.get('/turno', funcion2, authRequired, verifyRol('paciente'), (req, res) => {
  res.render('paciente/pacienteTurno');
});

router.get('/perfil', funcion2, authRequired, verifyRol('paciente'), (req, res) => {
  pacientePerfilC(req, res);
});

router.get('/editar', funcion2, authRequired, verifyRol('paciente'), (req, res) => {
  pacienteEditarC(req, res);
});

router.post('/editar', (req, res) => {
  updatePacienteC(req, res);
});

router.get('/foto',funcion2, authRequired, verifyRol('paciente'), (req, res) => {
  console.log('gettttt fotoOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO', req.res.req.user)
  getFotoC(req, res);
  res.render('paciente/pacienteEditarFoto');
});

router.post('/foto', (req, res) => {
  updateFotoC(req, res);
});

router.post('/crear', updatePacienteC);
router.delete('/borrar', borrarPaciente);
router.get('/listar', obtenerPacientesVistaC);

export default router;