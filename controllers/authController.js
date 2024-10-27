const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM usuario WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).send('Error en el servidor');
    if (result.length === 0) return res.status(404).send('Usuario no encontrado');
    
    const user = result[0];
    console.log("1authController-🚀 ~ db.query ~ result[0]:", result[0])
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send('Contraseña incorrecta');

    const token = jwt.sign({ id: user.usuario_id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
    req.token = token;
    console.log("2authController-🚀 ~ db.query ~ token:", token)
    res.status(200).send({ auth: true, token: token });
  });

};

exports.register = (req, res) => {
  const { email, password, rol } = req.body;
  const passwordHash = bcrypt.hashSync(password, 8);
  db.query('INSERT INTO usuario(email, password, rol) VALUES (?,?,?)', [email, passwordHash, rol], (err, result) => {
    if (err) return res.status(500).send('Error al registrar usuario.');
    return res.status(200).send('Usuario registrado');
  });
};