exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };
    
    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ 
                success: false,
                error: 'Method not allowed' 
            })
        };
    }
    
    try {
        // For now, return a message explaining the limitation
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Admin functionality requires a different setup for Netlify. The form data was received but cannot be processed in a read-only environment. Please contact your developer to set up a database-backed solution.',
                received_data: {
                    method: event.httpMethod,
                    content_type: event.headers['content-type'],
                    body_length: event.body ? event.body.length : 0
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
                error: 'Internal server error',
                details: error.message
            })
        };
    }
};