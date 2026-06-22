const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization; // expects "Bearer <token>"

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token, access denied' });
    }

    const token = authHeader.split(' ')[1]; // grab just the token part

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // attach user id to req, so later routes know who's calling
        next(); // token valid, proceed to the actual route
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = protect;