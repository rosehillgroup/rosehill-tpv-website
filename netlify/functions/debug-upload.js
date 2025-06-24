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
        // Return debug information about the request
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: false,
                debug: {
                    method: event.httpMethod,
                    contentType: event.headers['content-type'],
                    hasBody: !!event.body,
                    bodyLength: event.body ? event.body.length : 0,
                    bodyStart: event.body ? event.body.substring(0, 100) : 'no body',
                    isBase64: event.isBase64Encoded,
                    boundary: event.headers['content-type']?.includes('boundary=') 
                        ? event.headers['content-type'].split('boundary=')[1] 
                        : 'no boundary'
                }
            })
        };
        
    } catch (error) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Debug error: ' + error.message,
                stack: error.stack
            })
        };
    }
};