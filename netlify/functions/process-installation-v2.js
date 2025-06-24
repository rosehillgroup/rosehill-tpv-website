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
        // Initialize Supabase
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Database configuration missing'
                })
            };
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // For now, let's just test saving a simple record
        const testInstallation = {
            title: 'Test Installation - ' + new Date().toISOString(),
            location: 'Test Location, UK',
            installation_date: '2024-06-24',
            application: 'playground',
            description: ['Test description paragraph 1', 'Test description paragraph 2'],
            images: [],
            slug: 'test-installation-' + Date.now()
        };
        
        // Save to database
        const { data, error } = await supabase
            .from('installations')
            .insert([testInstallation])
            .select();
        
        if (error) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Database error: ' + error.message,
                    details: error
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
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Function error: ' + error.message,
                stack: error.stack
            })
        };
    }
};