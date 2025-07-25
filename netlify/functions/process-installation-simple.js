// Simplified version without multipart parsing to test basic functionality
const { createClient } = require('@supabase/supabase-js');

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
        // Log basic request info
        console.log('Request received:', {
            method: event.httpMethod,
            contentType: event.headers['content-type'] || event.headers['Content-Type'],
            bodyLength: event.body?.length || 0,
            isBase64: event.isBase64Encoded
        });
        
        // Initialize Supabase
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Database configuration missing'
                })
            };
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // For now, just return success without processing the form
        // This tests if the basic function structure works
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Function is working - multipart parsing disabled for testing',
                debug: {
                    contentType: event.headers['content-type'] || event.headers['Content-Type'],
                    bodyLength: event.body?.length || 0,
                    supabaseConnected: true
                }
            })
        };
        
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error: ' + error.message,
                stack: error.stack
            })
        };
    }
};