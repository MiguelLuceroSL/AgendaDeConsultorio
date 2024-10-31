import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { createAccessToken } from '../libs/jwt.js';

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
      
      res.cookie('token', token);
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
  const { email, password, rol } = req.body;
  const passwordHash = bcrypt.hashSync(password, 8);
  db.query('INSERT INTO usuario(email, password, rol) VALUES (?,?,?)', [email, passwordHash, rol], (err, result) => {
    if (err) return res.status(500).send('Error al registrar usuario.');
    return res.status(200).send('Usuario registrado');
  });
};