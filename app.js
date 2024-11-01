import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const app = express();

// Definir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración dotenv
dotenv.config();

// Importar middlewares y rutas
app.use(cookieParser());
import validateToken from './middlewares/validateToken.js';
import authRoutes from './routes/authRoutes.js';
import agendaRoutes from './routes/agendaRoutes.js';
import profesionalRoutes from './routes/profesionalRoutes.js';
import pacienteRoutes from './routes/pacientesRoutes.js';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/auth', authRoutes);
app.use('/agenda', agendaRoutes);
app.use('/profesional', profesionalRoutes);
app.use('/pacientes', pacienteRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/auth/register', (req, res) => {
  res.render('login');
});

app.get('/auth/login', (req, res) => {
  res.render('login');
});

app.get('/pacientes/paciente', validateToken, (req, res) => {
  console.log("1- app.js get pacientes/paciente");
  res.render('paciente');
});

app.get('/admin', (req, res) => {
  res.render('adminPanel');
});

app.get('/crearpaciente', (req, res) => {
  res.render('crearPaciente');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});