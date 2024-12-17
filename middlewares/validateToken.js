import jwt from 'jsonwebtoken';

export const authRequired = (req, res, next) => {
    console.log('validing token...');
    if (!req.cookies.token) res.status(403).json({ message: 'Debes loguearte.' })

    const token = req.cookies.token.trimStart();
    

    if (!token) res.status(401).json({ message: 'No token, authorization denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token:(' });
        console.log('USER DEL AUTH REQUIRED: ',user);
        req.user = user;
        next();
    });
};