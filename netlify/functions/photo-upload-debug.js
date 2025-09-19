// Debug version of photo upload that doesn't process files
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
    try {
        console.log('Debug function started, method:', event.httpMethod);
        console.log('Start time:', new Date(startTime).toISOString());

        // Only accept POST requests
        if (event.httpMethod !== 'POST') {
            return response(405, { error: 'Method not allowed' });
        }

        // Check environment variables
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

        console.log('Environment check passed');

        // Try to load dependencies
        const { createClient } = require('@supabase/supabase-js');
        const busboy = require('busboy');
        console.log('Dependencies loaded successfully');

        // Log request details without parsing
        console.log('Content-Type:', event.headers['content-type'] || event.headers['Content-Type']);
        console.log('Body length:', event.body?.length);
        console.log('isBase64Encoded:', event.isBase64Encoded);

        // Create Supabase client
        const supabase = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client created');

        // Test a simple database operation
        const { data, error } = await supabase
            .from('photo_submissions')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Database test failed:', error);
            return response(500, {
                error: 'Database connection failed',
                details: error.message
            });
        }

        console.log('Database test passed');

        const elapsed = Date.now() - startTime;
        return response(200, {
            success: true,
            message: 'Debug test completed successfully',
            debug: {
                elapsed_ms: elapsed,
                content_type: event.headers['content-type'] || event.headers['Content-Type'],
                body_length: event.body?.length,
                is_base64: event.isBase64Encoded,
                database_accessible: true,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        const elapsed = Date.now() - startTime;
        console.error('Debug function error:', error);
        console.error('Error stack:', error.stack);
        console.error('Elapsed time:', elapsed, 'ms');

        return response(500, {
            error: 'Debug function failed',
            details: error.message,
            elapsed_ms: elapsed,
            stack: error.stack
        });
    }
};