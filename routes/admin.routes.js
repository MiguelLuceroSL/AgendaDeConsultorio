import express from 'express';
import { obtenerProfesionalesC, actualizarEspecialidadC, actualizarMatriculaC, actualizarNombreCompletoC } from '../controllers/profesionalController.js';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';
const router = express.Router();

router.get('/home', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminPanel');
});

router.get('/cargarProfesional', authRequired, verifyRol('admin'), async (req, res) => {
    res.render('admin/adminCargarProfesional');
});

router.get('/cargarAgenda', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminCargarAgenda');
});

router.get('/createProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminCreateProfesional');
});

router.get('/registerSecretaria', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminRegisterSecretaria');
});


router.get('/readProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminReadProfesional');
});


router.get('/updateProfesional', authRequired, verifyRol('admin'), async (req, res) => {
  res.render('admin/adminUpdateProfesional');
});

router.post('/actualizarEspecialidad', authRequired, verifyRol('admin'), actualizarEspecialidadC);
router.post('/actualizarMatricula', authRequired, verifyRol('admin'), actualizarMatriculaC);
router.post('/actualizarNombreCompleto', authRequired, verifyRol('admin'), actualizarNombreCompletoC);

router.get('/deleteProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminDeleteProfesional');
});

export default router;