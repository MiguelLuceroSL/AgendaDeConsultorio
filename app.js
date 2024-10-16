const express = require('express');
const app = express();
const db = require('./config/db');
const path = require('path');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


//rutas
const authRoutes = require('./routes/authRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
const medicoRoutes = require('./routes/medicoRoutes.js');

app.use('/auth', authRoutes);
app.use('/agenda', agendaRoutes);
app.use('/medico', medicoRoutes);

app.get('/',(req,res)=>{
  res.render('home');
})

app.get('/auth/register', (req, res) => {
  res.render('login'); 
});

app.get('/auth/login', (req, res) => {
  res.render('login'); 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});