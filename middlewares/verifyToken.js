const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    console.log("1B-ENTRANDO A VERIFY TOKEN");
    
    try {
        console.log("2B-ENTRANDO AL TRY DE VERIFY TOKEN");
        const authHeader = req.headers['authorization'];
        console.log("PEDREGA🚀 ~ verifyToken ~ authHeader:", authHeader)

        // Si el token no está en el header `Authorization`, devuelve un error
        if (!authHeader) {
            console.log("5B-Token no proporcionado.");
            return res.status(403).send('Token no proporcionado.');
        }

        const tokenSinBearer = authHeader.replace('Bearer ', '');
        console.log("4B-🚀 ~ verifyToken ~ tokenSinBearer:", tokenSinBearer);

        await jwt.verify(tokenSinBearer, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(500).send('Token inválido');
            console.log("7B-REQ.USER: ", decoded);
            req.user = decoded;
            next();
        });
    } catch (err) {
        return res.status(500).send('Error verify token: ' + err.message);
    }
};

module.exports = verifyToken;