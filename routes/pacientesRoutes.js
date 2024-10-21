const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.post('/pacientes', pacienteController.crearPaciente);


module.exports = router;