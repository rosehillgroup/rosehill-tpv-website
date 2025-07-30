exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    try {
        // Check environment variables
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        
        const debugInfo = {
            hasSupabaseUrl: !!supabaseUrl,
            hasSupabaseKey: !!supabaseKey,
            supabaseUrlStart: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing',
            nodeVersion: process.version,
            timestamp: new Date().toISOString()
        };
        
        if (!supabaseUrl || !supabaseKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Database configuration missing',
                    debug: debugInfo
                })
            };
        }
        
        // Try to import Supabase
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Try the exact same query as the real function
        const { data, error } = await supabase
            .from('installations')
            .select('id, title, location, date, application, description, images, slug')
            .order('date', { ascending: false });
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                debug: debugInfo,
                supabaseTest: {
                    error: error ? error.message : null,
                    hasData: !!data
                }
            })
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Function error: ' + error.message,
                stack: error.stack
            })
        };
    }
};