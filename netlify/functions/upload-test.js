// Minimal upload test
exports.handler = async (event) => {
    try {
        console.log('Upload test started');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: true,
                message: 'Upload test works',
                method: event.httpMethod
            })
        };
    } catch (error) {
        console.error('Upload test error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Upload test failed',
                details: error.message
            })
        };
    }
};