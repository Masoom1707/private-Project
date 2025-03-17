import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
    const token = req.cookies?.token; 

    console.log(token)

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized, token not found.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized, invalid token.' });
    }
};

