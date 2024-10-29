const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

router.post('/crear', profesionalController.crearProfesional);
router.post('/crear/:especialidad_id',profesionalController.crearProfesionalEspecialidad)
router.delete('/borrar', profesionalController.borrarProfesional);

module.exports = router;