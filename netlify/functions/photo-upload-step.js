// Step by step photo upload debugging
const response = (statusCode, body) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
});

exports.handler = async (event) => {
    const startTime = Date.now();
    const steps = [];

    try {
        steps.push('Function started');
        console.log('Step-by-step photo upload started');

        if (event.httpMethod !== 'POST') {
            return response(405, { error: 'Method not allowed' });
        }
        steps.push('POST method confirmed');

        // Check environment
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) {
            return response(500, { error: 'Environment not configured' });
        }
        steps.push('Environment variables OK');

        // Load dependencies
        const { createClient } = require('@supabase/supabase-js');
        const busboy = require('busboy');
        steps.push('Dependencies loaded');

        // Create clients
        const supabase = createClient(supabaseUrl, supabaseKey);
        steps.push('Supabase client created');

        // Get content type and body info
        const contentType = event.headers['content-type'] || event.headers['Content-Type'];
        const bodyLength = event.body?.length;
        steps.push(`Content-Type: ${contentType}, Body length: ${bodyLength}`);

        // Try to create busboy instance
        let busboyInstance;
        try {
            busboyInstance = busboy({
                headers: {
                    'content-type': contentType,
                },
                limits: {
                    fileSize: 5 * 1024 * 1024, // 5MB limit per file
                    files: 10, // Max 10 files
                }
            });
            steps.push('Busboy instance created');
        } catch (busboyError) {
            steps.push(`Busboy creation failed: ${busboyError.message}`);
            return response(500, {
                error: 'Busboy creation failed',
                steps,
                details: busboyError.message
            });
        }

        // Try to parse multipart data with timeout
        try {
            steps.push('Starting multipart parsing...');

            const parseResult = await parseMultipartWithTimeout(event, contentType, 8000); // 8 second timeout
            steps.push(`Parsing completed: ${parseResult.fields ? Object.keys(parseResult.fields).length : 0} fields, ${parseResult.files ? parseResult.files.length : 0} files`);

            const elapsed = Date.now() - startTime;
            return response(200, {
                success: true,
                message: 'Step-by-step parsing completed',
                steps,
                elapsed_ms: elapsed,
                fields: parseResult.fields ? Object.keys(parseResult.fields) : [],
                fileCount: parseResult.files ? parseResult.files.length : 0,
                timestamp: new Date().toISOString()
            });

        } catch (parseError) {
            steps.push(`Parsing failed: ${parseError.message}`);
            const elapsed = Date.now() - startTime;
            return response(500, {
                error: 'Multipart parsing failed',
                steps,
                elapsed_ms: elapsed,
                details: parseError.message,
                stack: parseError.stack
            });
        }

    } catch (error) {
        const elapsed = Date.now() - startTime;
        steps.push(`Critical error: ${error.message}`);
        console.error('Step-by-step function error:', error);

        return response(500, {
            error: 'Function failed',
            steps,
            elapsed_ms: elapsed,
            details: error.message,
            stack: error.stack
        });
    }
};

function parseMultipartWithTimeout(event, contentType, timeoutMs) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error(`Parsing timeout after ${timeoutMs}ms`));
        }, timeoutMs);

        try {
            const fields = {};
            const files = [];

            const body = event.isBase64Encoded
                ? Buffer.from(event.body, 'base64')
                : event.body;

            const busboy = require('busboy');
            const bb = busboy({
                headers: {
                    'content-type': contentType,
                },
                limits: {
                    fileSize: 5 * 1024 * 1024,
                    files: 10,
                }
            });

            bb.on('file', (name, file, info) => {
                console.log('File received:', name, info.filename);
                const chunks = [];

                file.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                file.on('end', () => {
                    files.push({
                        fieldname: name,
                        filename: info.filename,
                        mimeType: info.mimeType,
                        size: Buffer.concat(chunks).length
                    });
                });
            });

            bb.on('field', (name, value) => {
                console.log('Field received:', name, value.length);
                fields[name] = value;
            });

            bb.on('finish', () => {
                clearTimeout(timeout);
                resolve({ fields, files });
            });

            bb.on('error', (error) => {
                clearTimeout(timeout);
                reject(error);
            });

            // Write data to busboy
            if (typeof body === 'string') {
                bb.write(Buffer.from(body, 'binary'));
            } else {
                bb.write(body);
            }
            bb.end();

        } catch (error) {
            clearTimeout(timeout);
            reject(error);
        }
    });
}