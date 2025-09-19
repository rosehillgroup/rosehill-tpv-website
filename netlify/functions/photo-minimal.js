// Minimal photo upload function to isolate build issues
exports.handler = async (event) => {
    try {
        console.log('Minimal photo function started');

        // Test 1: Basic response
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ error: 'Method not allowed' })
            };
        }

        // Test 2: Try to require busboy
        let busboyStatus = 'not tested';
        try {
            const busboy = require('busboy');
            busboyStatus = 'loaded successfully';
        } catch (e) {
            busboyStatus = `failed: ${e.message}`;
        }

        // Test 3: Try to require supabase
        let supabaseStatus = 'not tested';
        try {
            const { createClient } = require('@supabase/supabase-js');
            supabaseStatus = 'loaded successfully';
        } catch (e) {
            supabaseStatus = `failed: ${e.message}`;
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: true,
                message: 'Minimal photo function works',
                method: event.httpMethod,
                busboy: busboyStatus,
                supabase: supabaseStatus,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Minimal photo function error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Minimal photo function failed',
                details: error.message
            })
        };
    }
};