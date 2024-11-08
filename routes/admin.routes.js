import express from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';
const router = express.Router();

router.get('/home', authRequired, verifyRol('admin'), (req, res) => {
  res.render('adminPanel');
});

router.get('/cargarProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('adminCargarProfesional');
});

router.get('/cargarAgenda', authRequired, verifyRol('admin'), (req, res) => {
  res.render('adminCargarAgenda');
});

router.get('/createProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('adminCreateProfesional');
});

router.get('/readProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('adminReadProfesional');
});

export default router;