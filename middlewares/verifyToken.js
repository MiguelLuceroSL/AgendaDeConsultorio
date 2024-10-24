const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token no proporcionado.');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).send('Token inválido.');
    req.user = decoded; // Añadimos el usuario decodificado al request
    next();
  });
};

module.exports = verifyToken;