const jwt = require('jsonwebtoken');
const config = require('../app.config');

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers.token,config.tokens.secretKey );
        req.userDate = decoded;
    } catch (error) {
        return res.status(401).json({
            message: 'Auth Failed.'
        })
    }
    
    next();
};