// Test multipart parsing only
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Method not allowed' })
            };
        }

        // Simple multipart parsing test
        const busboy = require('busboy');
        const contentType = event.headers['content-type'] || event.headers['Content-Type'];
        const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;

        const bb = busboy({
            headers: { 'content-type': contentType },
            limits: { fileSize: 5 * 1024 * 1024, files: 10 }
        });

        const fields = {};
        const files = [];

        bb.on('field', (name, value) => {
            fields[name] = value;
        });

        bb.on('file', (name, file, info) => {
            const chunks = [];
            file.on('data', chunk => chunks.push(chunk));
            file.on('end', () => {
                files.push({
                    name,
                    filename: info.filename,
                    size: Buffer.concat(chunks).length
                });
            });
        });

        return new Promise((resolve) => {
            bb.on('finish', () => {
                resolve({
                    statusCode: 200,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({
                        success: true,
                        message: 'Parse only test successful',
                        fields: Object.keys(fields),
                        files: files.length
                    })
                });
            });

            bb.write(typeof body === 'string' ? Buffer.from(body, 'binary') : body);
            bb.end();
        });

    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Parse test failed', details: error.message })
        };
    }
};