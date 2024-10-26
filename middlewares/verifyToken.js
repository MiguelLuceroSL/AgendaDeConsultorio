const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  console.log("ENTRANDO A VERIFY TOKEN");
  try {
    console.log("ENTRANDO AL TRY DE VERIFY TOKEN");
    const token = req.headers['authorization'];
    console.log("🚀 ~ verifyToken ~ token:", token)
    const tokenSinBearer = token.replace('Bearer ', '');
    console.log("🚀 ~ verifyToken ~ tokenSinBearer:", tokenSinBearer)
    if (!token) {
      console.log("1-Token no proporcionado.");
      return res.status(403).send('Token no proporcionado.');
    }

    await jwt.verify(tokenSinBearer, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(500).send('Token inválido: ',err.message);
      console.log("REQ.USER: ", decoded);
      req.user = decoded;
      next();
    });
  } catch (err) {
    return res.status(500).send('Error verify token: ', err.message);
  }
};

module.exports = verifyToken;