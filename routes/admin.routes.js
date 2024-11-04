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

export default router;