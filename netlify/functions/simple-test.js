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
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Simple test working',
                data: {
                    method: event.httpMethod,
                    hasContentType: !!event.headers['content-type'],
                    contentType: event.headers['content-type'] || 'none',
                    hasBody: !!event.body,
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