const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { CLIENT_RENEG_LIMIT } = require('tls');

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
    if (err) throw err;
    if (results.length === 0 || !bcrypt.compareSync(password, results[0].password)) {
      return res.status(401).send('Email o contraseña incorrectos');
    }
    const token = jwt.sign({ id: results[0].id, rol: results[0].rol }, 'secretkey');
    res.json({ token });
  });
};

exports.register = (req, res) => {
  const { email, password, rol } = req.body;
  const passwordHash = bcrypt.hashSync(password,8);
  db.query('INSERT INTO `usuario`(`email`, `password`, `rol`) VALUES (?,?,?)', [email, passwordHash, rol],(err, ress)=> {
    if(err) throw err;
    if(ress.affectedRows==1){
      console.log("Se cargo el usuario!");
      console.log("PASS NORMAL: "+ password);
      console.log("PASS HASH: "+passwordHash);
      return res.status(200).send("algo");
    }
  })
}

exports.pruebar = (req, res) => {
  const {p1, p2} = req.body;
  if (bcrypt.compareSync(p1, p2)) {
    console.log("iguales");
    return res.status(200).send("iguales");
  } else {
    console.log("distintas");
    return res.status(200).send("distintas");
  }
}