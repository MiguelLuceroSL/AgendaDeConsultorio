import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';

export const login = (req, res) => {
  console.log('entrando al fetch back')
  console.log('REQ BACK LOGIN: ',req.body)
  try {
    const { email, password } = req.body;
    db.query('SELECT * FROM usuario WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).send('Error en el servidor');
      if (result.length === 0) return res.status(404).send('Usuario no encontrado');
      console.log('entrando al try del fetch back')
      const user = result[0];
      console.log("user authController: ", user);
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) return res.status(401).send('Contraseña incorrecta');
      const token = await createAccessToken({ id: user.usuario_id });
      res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
      if (user.rol === 'paciente') {
        console.log('entramos al rol paciente');
        db.query('SELECT * FROM paciente WHERE usuario_id = ?', [user.usuario_id], (err, pacienteResult) => {
          if (err) return res.status(500).send('Error al obtener los datos del paciente');
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
        }
        );
      } else {
        console.log('entramos al rol que no es paciente');
        return res.json({
          id: user.usuario_id,
          username: user.username,
          email: user.email,
          rol: user.rol,
        });
      }
    });
  } catch (error) {
    console.log('entramos al catch del fetch back')
    res.status(500).json({ 'Error message: ': error.message });
  }
  console.log('NO entramos ni al try ni al catch del fetch back')
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