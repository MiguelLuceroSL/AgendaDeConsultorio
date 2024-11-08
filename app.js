import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { funcion1 } from './middlewares/middle1.js';

const app = express();

// Definir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración dotenv
dotenv.config();

// Importar middlewares y rutas
app.use(cookieParser());
import authRoutes from './routes/auth.routes.js';
import agendaRoutes from './routes/agenda.routes.js';
import profesionalRoutes from './routes/profesional.routes.js';
import pacienteRoutes from './routes/pacientes.routes.js';
import adminRoutes from './routes/admin.routes.js';
import secretariaRoutes from './routes/secretaria.routes.js';

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
app.use('/admin', adminRoutes);
app.use('/secretaria', secretariaRoutes);

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

app.get('/admin', (req, res) => {
  res.render('admin/adminPanel');
});

app.get('/crearpaciente', (req, res) => {
  res.render('crearPaciente');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});