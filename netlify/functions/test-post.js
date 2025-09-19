// Test simple POST request handling
const response = (statusCode, body) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
});

exports.handler = async (event) => {
    try {
        console.log('Test POST function started');
        console.log('Method:', event.httpMethod);
        console.log('Headers:', JSON.stringify(event.headers, null, 2));

        return response(200, {
            success: true,
            message: 'POST test successful',
            method: event.httpMethod,
            contentType: event.headers['content-type'] || event.headers['Content-Type'],
            bodyLength: event.body?.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Test POST error:', error);
        return response(500, {
            error: 'Test POST failed',
            details: error.message
        });
    }
};