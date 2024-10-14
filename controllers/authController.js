const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM Usuarios WHERE email = ?', [email], (err, results) => {
    if (err) throw err;
    if (results.length === 0 || !bcrypt.compareSync(password, results[0].password)) {
      return res.status(401).send('Email o contraseña incorrectos');
    }
    const token = jwt.sign({ id: results[0].id, rol: results[0].rol }, 'secretkey');
    res.json({ token });
  });
};