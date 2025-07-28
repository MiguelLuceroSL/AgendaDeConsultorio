import express from 'express';
import { obtenerProfesionalesC, actualizarEspecialidadC, actualizarMatriculaC, actualizarNombreCompletoC, borrarProfesionalC } from '../controllers/profesionalController.js';
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

router.get('/adminUpdateEspecialidadSuccess', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminUpdateEspecialidadSuccess')
})

router.post('/actualizarMatricula', authRequired, verifyRol('admin'), actualizarMatriculaC);

router.get('/adminUpdateMatriculaSuccess', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminUpdateMatriculaSuccess')
})

router.post('/actualizarNombreCompleto', authRequired, verifyRol('admin'), actualizarNombreCompletoC);
router.get('/adminUpdateNameSuccess', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminUpdateNameSuccess')
})
router.get('/deleteProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminDeleteProfesional');
});

router.post('/cambiarEstado', authRequired, verifyRol('admin'), borrarProfesionalC);
router.get('/adminDeleteSuccess', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminDeleteSuccess');
})

export default router;