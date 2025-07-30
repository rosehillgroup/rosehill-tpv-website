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
            .select('id, title, location, installation_date, application, description, images, slug')
            .order('installation_date', { ascending: false });
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                debug: debugInfo,
                supabaseTest: {
                    error: error ? error.message : null,
                    hasData: !!data,
                    dataCount: data ? data.length : 0,
                    sampleData: data && data.length > 0 ? {
                        title: data[0].title,
                        slug: data[0].slug,
                        imagesType: typeof data[0].images,
                        imagesValue: data[0].images,
                        firstImageType: data[0].images && data[0].images.length > 0 ? typeof data[0].images[0] : 'none'
                    } : null
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