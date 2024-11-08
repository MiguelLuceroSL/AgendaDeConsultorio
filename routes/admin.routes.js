import express from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';
const router = express.Router();

router.get('/home', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminPanel');
});

router.get('/cargarProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminCargarProfesional');
});

router.get('/cargarAgenda', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminCargarAgenda');
});

router.get('/createProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminCreateProfesional');
});

router.get('/readProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminReadProfesional');
});

export default router;