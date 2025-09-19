// Simplified photo upload function for debugging
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
        console.log('Simple photo upload started');
        console.log('Method:', event.httpMethod);
        console.log('Headers:', JSON.stringify(event.headers, null, 2));
        console.log('Body length:', event.body?.length);
        console.log('isBase64Encoded:', event.isBase64Encoded);

        // Only accept POST requests
        if (event.httpMethod !== 'POST') {
            return response(405, { error: 'Method not allowed' });
        }

        // Check environment variables
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

        console.log('Environment check:', {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseKey
        });

        if (!supabaseUrl || !supabaseKey) {
            return response(500, {
                error: 'Storage service not configured',
                debug: {
                    hasUrl: !!supabaseUrl,
                    hasKey: !!supabaseKey
                }
            });
        }

        // Try to load Supabase
        console.log('Loading Supabase...');
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client created successfully');

        // Try to load busboy
        console.log('Loading busboy...');
        const busboy = require('busboy');
        console.log('Busboy loaded successfully');

        // For now, just return success to test basic functionality
        return response(200, {
            success: true,
            message: 'Simple test successful',
            debug: {
                method: event.httpMethod,
                hasBody: !!event.body,
                bodyLength: event.body?.length,
                contentType: event.headers['content-type'] || event.headers['Content-Type'],
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Simple function error:', error);
        console.error('Error stack:', error.stack);

        return response(500, {
            error: 'Function failed',
            details: error.message,
            stack: error.stack
        });
    }
};