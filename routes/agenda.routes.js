import express from 'express';
const router = express.Router();
import {crearAgendaC, obtenerAgendasC, actulizarAgendaC, borrarAgendaC, obtenerAgendasActivasC, FormCrearAgendaVista} from '../controllers/agendaController.js';

router.get('/crear', FormCrearAgendaVista);
router.post('/crear', crearAgendaC); 
router.get('/getagendas', obtenerAgendasC);
router.put('/actagendas', actulizarAgendaC);
router.delete('/delagendas', borrarAgendaC);
router.get('/agendas/:profesionalId', obtenerAgendasActivasC);

export default router;