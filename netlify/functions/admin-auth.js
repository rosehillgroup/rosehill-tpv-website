const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }
    
    try {
        const { password } = JSON.parse(event.body);
        
        if (!password) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, error: 'Password is required' })
            };
        }
        
        // Get admin password hash from environment variable
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-this';
        
        if (!adminPasswordHash) {
            console.error('ADMIN_PASSWORD_HASH not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ success: false, error: 'Authentication not configured' })
            };
        }
        
        // Verify password
        const isValid = await bcrypt.compare(password, adminPasswordHash);
        
        if (!isValid) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ success: false, error: 'Invalid password' })
            };
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                role: 'admin',
                iat: Math.floor(Date.now() / 1000)
            },
            jwtSecret,
            { expiresIn: '24h' }
        );
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                token,
                expiresIn: 86400 // 24 hours in seconds
            })
        };
        
    } catch (error) {
        console.error('Auth error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: 'Authentication failed' })
        };
    }
};