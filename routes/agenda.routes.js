import express from 'express';
const router = express.Router();
import {crearAgendaC, obtenerAgendasC, actulizarAgendaC, borrarAgendaC, obtenerAgendasActivasC, FormCrearAgendaVista, registrarAusenciaC, verificarAusenciaC, formCrearAusenciaC, obtenerAusenciasTotalesC, eliminarAusenciaC, listarAgendasActivasC, eliminarAgendaC, buscarSucursalesC} from '../controllers/agendaController.js';
import { authRequired } from '../middlewares/validateToken.js';

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
router.delete('/ausencias/:id', eliminarAusenciaC);
router.get('/listar', authRequired, listarAgendasActivasC);
router.delete('/:id', authRequired, eliminarAgendaC);
router.get('/buscar-sucursales', authRequired, buscarSucursalesC);

export default router;