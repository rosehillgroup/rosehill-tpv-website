// Ultra-simple function to test basic Netlify functions
exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            message: 'Hello from Netlify function',
            method: event.httpMethod,
            timestamp: new Date().toISOString()
        })
    };
};