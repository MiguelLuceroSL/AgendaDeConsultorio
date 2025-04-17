import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';

import connectDB from '../config/db.js';

export const login = async (req, res) => {
  console.log('Entrando al fetch back');
  console.log('REQ BACK LOGIN:', req.body);

  try {
    const db = await connectDB(); // Esperar la conexión

    const { email, password } = req.body;
    const [result] = await db.execute('SELECT * FROM usuario WHERE email = ?', [email]);

    if (result.length === 0) return res.status(404).send('Usuario no encontrado');

    console.log('Entrando al try del fetch back');
    const user = result[0];
    console.log('User authController:', user);

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (passwordIsValid) {
      console.log("contraseñas coinciden")
    } else {
      console.log("contraseñas no coinciden")
    }
    if (!passwordIsValid) return res.status(401).send('Contraseña incorrecta');

    const token = await createAccessToken({ id: user.usuario_id });
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });

    if (user.rol === 'paciente') {
      console.log('Entramos al rol paciente');
      const [pacienteResult] = await db.execute('SELECT * FROM paciente WHERE usuario_id = ?', [user.usuario_id]);
      console.log("PACIENTE RESULT: ",pacienteResult);
      if (pacienteResult.length === 0) return res.status(404).send('Datos del paciente no encontrados');

      const paciente = pacienteResult[0];
      return res.json({
        id: user.usuario_id,
        username: user.username,
        email: user.email,
        rol: user.rol,
        datosPaciente: {
          nombre_completo: paciente.nombre_completo,
          dni: paciente.dni,
          obra_social: paciente.obra_social,
          telefono: paciente.telefono,
          email: paciente.email,
          direccion: paciente.direccion,
          fecha_nacimiento: paciente.fecha_nacimiento,
        },
      });
    } else {
      console.log('Entramos al rol que no es paciente');
      return res.json({
        id: user.usuario_id,
        username: user.username,
        email: user.email,
        rol: user.rol,
      });
    }
  } catch (error) {
    console.log('Entramos al catch del fetch back');
    res.status(500).json({ error: error.message });
  }
};



export const register = async (req, res) => {
  const { nombre, email, dni, mutual, direccion, telefono, fecha_nacimiento, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 8);
  const rol = "paciente";

  try {
    // Inserta en la tabla usuario
    const insertUserQuery = 'INSERT INTO usuario(email, password, rol) VALUES (?, ?, ?)';
    await db.query(insertUserQuery, [email, passwordHash, rol]);

    // Obtiene el usuario_id recién creado
    const selectUserIdQuery = 'SELECT usuario_id FROM usuario WHERE email = ?';
    const [userResult] = await db.query(selectUserIdQuery, [email]);

    if (userResult.length === 0) {
      return res.status(404).send('Datos del usuario no encontrados.');
    }

    const usuarioId = userResult[0].usuario_id;

    // Inserta en la tabla paciente
    const insertPacienteQuery = `
      INSERT INTO paciente(
        nombre_completo, dni, obra_social, telefono, email, direccion, fecha_nacimiento, usuario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(insertPacienteQuery, [nombre, dni, mutual, telefono, email, direccion, fecha_nacimiento, usuarioId]);

    // Renderiza la vista de éxito
    res.render('registerSuccess', { message: '¡Usuario creado con éxito!' });

  } catch (error) {
    console.error('Error al registrar usuario o paciente:', error);
    res.status(500).send('Error al registrar usuario o paciente.');
  }
};


export const registerSecretaria = (req, res) => {
  const { email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 8);
  const rol = "secretaria";
  db.query('INSERT INTO usuario(email, password, rol) VALUES (?,?,?)', [email, passwordHash, rol], (err, result) => {
    if (err) return res.status(500).send('Error al registrar la secretaria.');
    return res.render('admin/adminSecretariaSuccess', { message: '¡Secretaria creada con éxito!' });
  });
};

export const getRole = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
    res.json({ rol: decoded.rol });
  });
};

// Nueva función para hacer logout
export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};