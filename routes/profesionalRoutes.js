const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

router.post('/crear', profesionalController.crearProfesional);

module.exports = router;