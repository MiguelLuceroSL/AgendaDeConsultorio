const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);

router.post('/register',authController.register);

router.post('/comparePass',authController.comparePass);

module.exports = router;