import mysql from 'mysql2/promise';

const connectDB = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aasss',
  });

  console.log('Conectado a la base de datos MySQL');
  return connection;
};

export default connectDB;
//para miguel aasss
//para juan agenda_consultorio
