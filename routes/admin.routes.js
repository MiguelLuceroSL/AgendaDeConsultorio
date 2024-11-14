import express from 'express';
import { obtenerProfesionalesC, actualizarEspecialidadC } from '../controllers/profesionalController.js';
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

router.get('/deleteProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminDeleteProfesional');
});

export default router;