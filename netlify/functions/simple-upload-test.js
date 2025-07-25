const { createClient } = require('@supabase/supabase-js');

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
    
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }
    
    try {
        // Check environment variables
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Database configuration missing',
                    debug: {
                        supabase_url_set: !!supabaseUrl,
                        supabase_key_set: !!supabaseKey
                    }
                })
            };
        }
        
        // Initialize Supabase
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Parse request body (assuming JSON for testing)
        let requestData;
        try {
            requestData = JSON.parse(event.body);
        } catch (e) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid JSON in request body'
                })
            };
        }
        
        // Create simple test installation
        const testData = {
            title: requestData.title || 'Test Installation',
            location: requestData.location || 'Test Location',
            installation_date: requestData.date || new Date().toISOString().split('T')[0],
            application: requestData.application || 'playground',
            description: requestData.description || ['Test description'],
            images: [],
            slug: 'test-installation-' + Date.now()
        };
        
        // Insert to database
        const { data, error } = await supabase
            .from('installations')
            .insert([testData])
            .select();
        
        if (error) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Database error: ' + error.message,
                    code: error.code
                })
            };
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Test installation created successfully',
                data: data[0]
            })
        };
        
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error: ' + error.message,
                stack: error.stack
            })
        };
    }
};