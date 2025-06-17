import express from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';
import { obtenerProfesionalesVistaC } from '../controllers/turnoController.js';
const router = express.Router();

router.get('/home', authRequired, verifyRol('secretaria'), (req, res) => {
  res.render('secretaria/secretariaPanel');
});

/*router.get('/gestionTurno', authRequired, verifyRol('admin'), (req, res) => {
    res.render('secretaria/secretariaGestionTurno');
  });*/

router.get('/gestionTurno', authRequired, verifyRol('secretaria'), obtenerProfesionalesVistaC);

export default router;