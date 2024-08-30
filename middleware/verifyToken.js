const jwt = require('jsonwebtoken');
const user = require('../models/userModel');
require('dotenv/config');

const verifyToken = async (req, res, next) => {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        const error = new Error('No token provided');
        error.statusCode = 401;
        return next(error);
    }

    
    const token = authorizationHeader.replace('Bearer ', '');

    try {
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded,"okkk");
        req.user = decoded;
        next();
    } catch (error) {
        // Log the token and error for debugging purposes
        console.error('JWT Token:', token);
        console.error('JWT Verification Error:', error.message);
       
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;
