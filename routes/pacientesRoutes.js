const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRol');

router.get('/paciente', (req, res) => {
    console.log("1- get /paciente pacientesRoutes.js")
    console.log("REQ DEL PACIENTES ROUTES: ",req.headers.authorization)
    console.log("REQ.USER DEL VERIFYTOKEN: ", req.user)
    res.render('paciente'); // Renderiza la vista 'paciente.pug'
  });

router.post('/crear', pacienteController.crearPaciente);
router.delete('/borrar', pacienteController.borrarPaciente);

module.exports = router;