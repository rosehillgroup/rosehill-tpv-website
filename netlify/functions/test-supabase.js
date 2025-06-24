const { createClient } = require('@supabase/supabase-js');

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
        
        if (!supabaseUrl || !supabaseKey) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing environment variables',
                    debug: {
                        hasUrl: !!supabaseUrl,
                        hasKey: !!supabaseKey,
                        urlStart: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing'
                    }
                })
            };
        }
        
        // Test Supabase connection
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Simple test query
        const { data, error } = await supabase
            .from('installations')
            .select('count(*)')
            .limit(1);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Supabase connection working',
                debug: {
                    hasConnection: !error,
                    error: error?.message || null,
                    data: data
                }
            })
        };
        
    } catch (error) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Function error: ' + error.message,
                stack: error.stack
            })
        };
    }
};