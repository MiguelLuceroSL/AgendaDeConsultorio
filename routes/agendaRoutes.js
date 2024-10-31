import express from 'express';
const router = express.Router();
import {getAgendas, reservarTurno} from '../controllers/agendaController.js';

router.get('/', getAgendas);
router.post('/reservar', reservarTurno);

export default router;