import express from 'express';
import {crearTurnoC, selTurnoC,borrarTurnoC, actualizarTurnoC ,confTurnoC, obtenerProfesionalesVistaC, traerTurnosC, getTurnosOcupadosController, traerTurnoPorIdC, crearTurnoPacienteC, traerTurnoPorId2C, editarEstadoTurnoC, obtenerTurnoYMedicosC, actualizarTurnoTrasladoC, verificarSobreturnos, obtenerHorariosPorEstadoC, obtenerTurnoParaReasignarC, reasignarTurnoC, obtenerSucursalesC} 
from '../controllers/turnoController.js';
import { authRequired } from '../middlewares/validateToken.js';
import multer from 'multer';
import { storage } from '../config/cloudinaryConfig.js';


const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WEBP)'), false);
    }
  }
});

const router = express.Router()

router.post('/crear', upload.single('dni_foto'), crearTurnoC);
router.post('/crearPaciente', upload.single('dni_foto'), crearTurnoPacienteC);
router.get('/secretaria/secretariaTurnoSuccess', (req, res) => {
    res.render('secretaria/secretariaTurnoSuccess')
})

router.get('/buscar', selTurnoC);

router.delete('/borrar/:id', borrarTurnoC);

router.put('/actualizar', actualizarTurnoC);

router.put('/confirmar', confTurnoC);

router.get('/horarios/ocupados', getTurnosOcupadosController);

//router.get('/listarProfesionales', obtenerProfesionalesVistaC);

//router.get('/gestionTurno', obtenerProfesionalesVistaC);

router.get('/listarTurnos', authRequired, traerTurnosC)

router.get('/detalles/:id', authRequired, traerTurnoPorIdC);

router.get('/editarTurno/:id', authRequired, traerTurnoPorId2C);

router.post('/editar/:id', authRequired, editarEstadoTurnoC);

router.get('/trasladar/:id', authRequired, obtenerTurnoYMedicosC);

router.post('/trasladar/:id', authRequired, actualizarTurnoTrasladoC);

router.get('/reasignar/:id', authRequired, obtenerTurnoParaReasignarC);

router.post('/reasignar/:id', authRequired, reasignarTurnoC);

router.get("/horarios/estado", obtenerHorariosPorEstadoC);

router.get('/sobreturnos/verificar', verificarSobreturnos);

router.get('/sucursales', obtenerSucursalesC);

// Middleware para manejar errores de multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('El archivo es demasiado grande. El tamaño máximo permitido es 10MB.');
    }
    return res.status(400).send(`Error al subir archivo: ${err.message}`);
  } else if (err) {
    return res.status(400).send(err.message);
  }
  next();
});

/*router.get('/secretaria/home', (req, res) => {
  res.redirect('/turnos/listarTurnos');
});*/

export default router;