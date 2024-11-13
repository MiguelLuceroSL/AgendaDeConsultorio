import express from 'express';
import { obtenerProfesionalesC, actualizarEspecialidadC } from '../controllers/profesionalController.js';
import { authRequired } from '../middlewares/validateToken.js';
import verifyRol from '../middlewares/verifyRol.js';
const router = express.Router();

router.get('/home', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminPanel');
});

router.get('/cargarProfesional', authRequired, verifyRol('admin'), async (req, res) => {
  try {
    // Obtener los profesionales (médicos)
    const profesionales = await obtenerProfesionalesC(); // Asegúrate de que esta función devuelva los datos correctos
    res.render('admin/adminReadProfesional', { profesionales });
  } catch (error) {
    console.error('Error al cargar los profesionales:', error);
    res.status(500).send('Error al cargar los profesionales');
  }
});

router.get('/cargarAgenda', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminCargarAgenda');
});

router.get('/createProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminCreateProfesional');
});

/*router.get('/readProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminReadProfesional');
});*/


router.get('/updateProfesional', authRequired, verifyRol('admin'), async (req, res) => {
  try {
    const profesionales = await obtenerProfesionalesC();
    res.render('admin/adminUpdateProfesional', { profesionales });
  } catch (error) {
    console.error('Error al cargar los médicos para actualizar:', error);
    res.status(500).send('Error al cargar los médicos para actualizar');
  }
});

router.post('/actualizarEspecialidad', authRequired, verifyRol('admin'), actualizarEspecialidadC);

router.get('/deleteProfesional', authRequired, verifyRol('admin'), (req, res) => {
  res.render('admin/adminDeleteProfesional');
});

export default router;