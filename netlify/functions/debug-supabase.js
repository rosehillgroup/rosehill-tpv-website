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
            timestamp: new Date().toISOString(),
            environment_check: {
                supabase_url_set: !!supabaseUrl,
                supabase_key_set: !!supabaseKey,
                supabase_url_format: supabaseUrl ? (supabaseUrl.includes('supabase.co') ? 'valid' : 'invalid') : 'missing',
                supabase_key_length: supabaseKey ? supabaseKey.length : 0
            },
            node_version: process.version,
            function_name: context.functionName || 'unknown'
        };
        
        // Try to initialize Supabase if variables exist
        if (supabaseUrl && supabaseKey) {
            try {
                const { createClient } = require('@supabase/supabase-js');
                const supabase = createClient(supabaseUrl, supabaseKey);
                
                // Test basic connection
                const { data, error } = await supabase
                    .from('installations')
                    .select('count', { count: 'exact', head: true });
                
                if (error) {
                    debugInfo.supabase_test = {
                        status: 'error',
                        error: error.message,
                        code: error.code
                    };
                } else {
                    debugInfo.supabase_test = {
                        status: 'success',
                        count: data
                    };
                }
                
            } catch (clientError) {
                debugInfo.supabase_test = {
                    status: 'client_error',
                    error: clientError.message
                };
            }
        } else {
            debugInfo.supabase_test = {
                status: 'skipped',
                reason: 'missing_environment_variables'
            };
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(debugInfo, null, 2)
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Debug function failed',
                message: error.message,
                stack: error.stack
            }, null, 2)
        };
    }
};