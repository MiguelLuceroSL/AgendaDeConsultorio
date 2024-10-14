const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

router.get('/', agendaController.getAgendas);
router.post('/reservar', agendaController.reservarTurno);

module.exports = router;