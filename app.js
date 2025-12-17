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
import authRoutes from './routes/auth.routes.js';
import agendaRoutes from './routes/agenda.routes.js';
import profesionalRoutes from './routes/profesional.routes.js';
import pacienteRoutes from './routes/pacientes.routes.js';
import adminRoutes from './routes/admin.routes.js';
import secretariaRoutes from './routes/secretaria.routes.js';
import turnoRoutes from './routes/turno.routes.js';
import infoRoutes from './routes/info.routes.js';



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/auth', authRoutes);
app.use('/agendas', agendaRoutes);
app.use('/profesional', profesionalRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/admin', adminRoutes);
app.use('/secretaria', secretariaRoutes);
app.use('/turnos', turnoRoutes);
app.use(infoRoutes);

// Ruta principal
app.get('/', (req, res) => {
  const { msg } = req.query;
  res.render('home', { msg });
});

app.get('/auth/register', (req, res) => {
  res.render('register');
});

app.get('/auth/login', (req, res) => {
  res.render('login', {
    query: req.query
  });
});

app.get('/admin', (req, res) => {
  res.render('admin/adminPanel');
});

app.get('/crearpaciente', (req, res) => {
  res.render('crearPaciente');
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});