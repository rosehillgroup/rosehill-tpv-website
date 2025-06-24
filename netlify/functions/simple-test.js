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
    
    try {
        // If it's a GET request, return different info
        if (event.httpMethod === 'GET') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'GET request received - function is working',
                    data: {
                        method: event.httpMethod,
                        nodeVersion: process.version,
                        note: 'This should be a POST request from the form'
                    }
                })
            };
        }
        
        // For POST requests, show more detail
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'POST request received successfully!',
                data: {
                    method: event.httpMethod,
                    hasContentType: !!event.headers['content-type'],
                    contentType: event.headers['content-type'] || 'none',
                    hasBody: !!event.body,
                    bodyLength: event.body ? event.body.length : 0,
                    isBase64: event.isBase64Encoded,
                    nodeVersion: process.version,
                    timestamp: new Date().toISOString()
                }
            })
        };
        
    } catch (error) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                stack: error.stack
            })
        };
    }
};