const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

router.post('/crear', profesionalController.crearProfesional);
router.delete('/borrar', profesionalController.borrarProfesional);

module.exports = router;