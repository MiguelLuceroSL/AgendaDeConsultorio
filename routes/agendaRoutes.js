import express from 'express';
const router = express.Router();
import {crearAgendaC, obtenerAgendasC, actulizarAgendaC, borrarAgendaC} from '../controllers/agendaController.js';

router.post('/crearagendas', crearAgendaC);
router.get('/getagendas', obtenerAgendasC);
router.put('/actagendas', actulizarAgendaC);
router.delete('/delagendas', borrarAgendaC);

export default router;