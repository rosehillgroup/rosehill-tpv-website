const jwt = require('jsonwebtoken');

function verifyToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { valid: false, error: 'No token provided' };
    }
    
    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-this';
    
    try {
        const decoded = jwt.verify(token, jwtSecret);
        
        // Check if token has admin role
        if (decoded.role !== 'admin') {
            return { valid: false, error: 'Insufficient permissions' };
        }
        
        return { valid: true, decoded };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { valid: false, error: 'Token expired' };
        }
        return { valid: false, error: 'Invalid token' };
    }
}

module.exports = { verifyToken };