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
    
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
    
    try {
        // Initialize Supabase
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        
        console.log('Environment check:', {
            hasSupabaseUrl: !!supabaseUrl,
            hasSupabaseKey: !!supabaseKey,
            urlStart: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing'
        });
        
        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Database configuration missing',
                    debug: {
                        hasSupabaseUrl: !!supabaseUrl,
                        hasSupabaseKey: !!supabaseKey
                    }
                })
            };
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client created successfully');
        
        // Check if a specific installation slug is requested
        const slug = event.queryStringParameters?.slug;
        
        if (slug) {
            // Get specific installation
            const { data: installation, error } = await supabase
                .from('installations')
                .select('*')
                .eq('slug', slug)
                .single();
                
            if (error) {
                console.error('Supabase error:', error);
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Installation not found' })
                };
            }
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ installation })
            };
        } else {
            // Get all installations for public display
            console.log('Fetching all installations...');
            const { data: installations, error } = await supabase
                .from('installations')
                .select('*')
                .order('date', { ascending: false });
                
            console.log('Query result:', {
                hasError: !!error,
                dataCount: installations ? installations.length : 0,
                errorMessage: error ? error.message : null
            });
                
            if (error) {
                console.error('Supabase error:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Failed to fetch installations',
                        debug: error.message
                    })
                };
            }
            
            console.log('Returning successful response with', installations?.length || 0, 'installations');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ installations: installations || [] })
            };
        }
        
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};