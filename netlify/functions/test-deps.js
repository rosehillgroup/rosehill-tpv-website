// Simple test function to verify dependencies are available
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
        console.log('Testing dependencies...');

        // Test Supabase
        let supabaseStatus = 'not available';
        try {
            const { createClient } = require('@supabase/supabase-js');
            supabaseStatus = 'available';
        } catch (e) {
            supabaseStatus = `error: ${e.message}`;
        }

        // Test busboy
        let busboyStatus = 'not available';
        try {
            const busboy = require('busboy');
            busboyStatus = 'available';
        } catch (e) {
            busboyStatus = `error: ${e.message}`;
        }

        // Test environment variables
        const envVars = {
            SUPABASE_URL: !!process.env.SUPABASE_URL,
            SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
            VITE_PUBLIC_SUPABASE_URL: !!process.env.VITE_PUBLIC_SUPABASE_URL,
            VITE_PUBLIC_SUPABASE_ANON_KEY: !!process.env.VITE_PUBLIC_SUPABASE_ANON_KEY
        };

        return response(200, {
            message: 'Dependency test completed',
            dependencies: {
                supabase: supabaseStatus,
                busboy: busboyStatus
            },
            environment: envVars,
            nodeVersion: process.version,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Test function error:', error);
        return response(500, {
            error: 'Test function failed',
            details: error.message,
            stack: error.stack
        });
    }
};