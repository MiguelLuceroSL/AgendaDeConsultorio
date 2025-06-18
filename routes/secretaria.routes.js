import express from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';
import { obtenerProfesionalesVistaC } from '../controllers/turnoController.js';
import { crearListaEsperaC, listarListaEsperaC , obtenerProfesionalesEsperaC} from '../controllers/listaEsperaController.js';
const router = express.Router();

router.get('/home', authRequired, verifyRol('secretaria'), (req, res) => {
  res.render('secretaria/secretariaPanel');
});

/*router.get('/gestionTurno', authRequired, verifyRol('admin'), (req, res) => {
    res.render('secretaria/secretariaGestionTurno');
  });*/

router.get('/gestionTurno', authRequired, verifyRol('secretaria'), obtenerProfesionalesVistaC);

router.get('/crearListaEspera', authRequired, verifyRol('secretaria'), obtenerProfesionalesEsperaC);
router.post('/crearEspera', authRequired, verifyRol('secretaria'), crearListaEsperaC);
router.get('/listarEspera', authRequired, verifyRol('secretaria'), listarListaEsperaC);

export default router;