const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRol');

router.post('/crear', pacienteController.crearPaciente);
router.delete('/borrar', pacienteController.borrarPaciente);
router.get('/paciente', verifyToken, verifyRole(['paciente']), (req, res) => {
    res.render('paciente'); // Renderiza la vista 'paciente.pug'
});
module.exports = router;