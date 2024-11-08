import express from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';
const router = express.Router();

router.get('/home', authRequired, verifyRol('admin'), (req, res) => {
  res.render('secretaria/secretariaPanel');
});

router.get('/gestionTurno', authRequired, verifyRol('admin'), (req, res) => {
    res.render('secretaria/secretariaGestionTurno');
  });

export default router;