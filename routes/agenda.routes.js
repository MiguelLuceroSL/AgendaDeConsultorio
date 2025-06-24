import express from 'express';
const router = express.Router();
import {crearAgendaC, obtenerAgendasC, actulizarAgendaC, borrarAgendaC, obtenerAgendasActivasC, FormCrearAgendaVista, registrarAusenciaC, verificarAusenciaC, formCrearAusenciaC, obtenerAusenciasTotalesC} from '../controllers/agendaController.js';

router.get('/crear', FormCrearAgendaVista);
router.post('/crear', crearAgendaC); 
router.get('/getagendas', obtenerAgendasC);
router.put('/actagendas', actulizarAgendaC);
router.delete('/delagendas', borrarAgendaC);
router.get('/agendas/:profesionalId', obtenerAgendasActivasC);
router.post('/ausencias/registrar', registrarAusenciaC);
router.get('/ausencias/verificar', verificarAusenciaC);
router.get('/ausencias/form', formCrearAusenciaC);
router.get('/ausencias/totales', obtenerAusenciasTotalesC);

export default router;