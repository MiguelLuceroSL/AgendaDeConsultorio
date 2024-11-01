import jwt from 'jsonwebtoken';

const authRequired = (req, res, next) => {
    console.log('validing token...');
    const token = req.cookies.token;

    if (!token) res.status(401).json({ message: 'No token, authorization denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        req.user = user;
        next();
    });
};

export default authRequired;