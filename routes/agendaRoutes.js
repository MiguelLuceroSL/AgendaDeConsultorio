import express from 'express';
const router = express.Router();
import {getAgendas, reservarTurno} from '../controllers/agendaController.js';

router.get('/', getAgendas);
router.post('/reservar', reservarTurno);

export default router;


/*import express from 'express';
const router = express.Router();
import {crearAgendaC, actulizarAgendaC, borrarAgendaC} from '../controllers/agendaController.js';

router.post('/crearagendas', crearAgendaC);
router.get('getagendas', obtenerAgendasC);
router.put('/actagendas', actulizarAgendaC);
router.delete('/delagendas', borrarAgendaC);

export default router;*/