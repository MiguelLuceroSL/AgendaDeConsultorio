const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.post('/crear', pacienteController.crearPaciente);
router.delete('/borrar', pacienteController.borrarPaciente);


module.exports = router;