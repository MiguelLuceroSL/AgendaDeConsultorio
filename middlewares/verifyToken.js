import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
    console.log("1B-ENTRANDO A VERIFY TOKEN");
    
    try {
        const authHeader = req.headers['authorization'];

        // Si el token no está en el header `Authorization`, devuelve un error
        if (!authHeader) {
            console.log("5B-Token no proporcionado.");
            return res.status(403).send('Token no proporcionado.');
        }

        const tokenSinBearer = authHeader.replace('Bearer ', '');

        await jwt.verify(tokenSinBearer, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(500).send('Token inválido');
            req.user = decoded;
            next();
        });
    } catch (err) {
        return res.status(500).send('Error verify token: ' + err.message);
    }
};

module.exports = verifyToken;