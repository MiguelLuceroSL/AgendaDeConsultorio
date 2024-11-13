import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';

export const login = (req, res) => {
  const { email, password } = req.body;

  try {
    db.query('SELECT * FROM usuario WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).send('Error en el servidor');
      if (result.length === 0) return res.status(404).send('Usuario no encontrado');

      const user = result[0];

      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) return res.status(401).send('Contraseña incorrecta');

      const token = await createAccessToken({ id: user.usuario_id });
      console.log("🚀authController token:", token)
      
      res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
      res.json({
        id: user.usuario_id,
        username: user.username,
        email: user.email,
        rol: user.rol,
      });
    });
  } catch (error) {
    res.status(500).json({ 'Error message: ': error.message });
  }
};

export const register = (req, res) => {
  const { email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 8);
  const rol = "paciente";
  db.query('INSERT INTO usuario(email, password, rol) VALUES (?,?,?)', [email, passwordHash, rol], (err, result) => {
    if (err) return res.status(500).send('Error al registrar usuario.');
    return res.render('registerSuccess', {message: '¡Usuario creado con éxito!'});
  });
};

export const registerSecretaria = (req, res) => {
  const { email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 8);
  const rol = "secretaria";
  db.query('INSERT INTO usuario(email, password, rol) VALUES (?,?,?)', [email, passwordHash, rol], (err, result) => {
    if (err) return res.status(500).send('Error al registrar la secretaria.');
    return res.render('admin/adminSecretariaSuccess', {message: '¡Secretaria creada con éxito!'});
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