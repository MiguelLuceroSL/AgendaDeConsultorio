const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');

router.post('/crear', medicoController.crearMedico);

module.exports = router;