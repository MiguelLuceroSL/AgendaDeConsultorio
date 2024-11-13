import mysql from 'mysql2';
const connection = mysql.createConnection({
  /*
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  */

  //Para hacer pruebas en localhost descomentar esto de abajo, y comentar las variables .env

  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aass',
  //para miguel aass
  //para juan agenda_consultorio
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

export default connection;