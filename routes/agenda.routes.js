import express from 'express';
const router = express.Router();
import {crearAgendaC, obtenerAgendasC, actulizarAgendaC, borrarAgendaC, obtenerAgendasActivasC} from '../controllers/agendaController.js';

router.post('/crearagendas', crearAgendaC);
router.get('/getagendas', obtenerAgendasC);
router.put('/actagendas', actulizarAgendaC);
router.delete('/delagendas', borrarAgendaC);
router.get('/agendas/:profesionalId', obtenerAgendasActivasC);

export default router;