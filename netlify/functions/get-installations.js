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
        
        if (!supabaseUrl || !supabaseKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Database configuration missing' })
            };
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Get all installations, ordered by date (newest first)
        const { data, error } = await supabase
            .from('installations')
            .select('*')
            .order('installation_date', { ascending: false });
        
        if (error) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Database error: ' + error.message })
            };
        }
        
        // Transform the data to match the old JSON format
        const installations = data.map(installation => ({
            title: installation.title,
            location: installation.location,
            date: installation.installation_date,
            application: installation.application,
            description: installation.description,
            images: installation.images.map(img => {
                // Handle different image data structures
                if (typeof img === 'string') {
                    // Old format: just a filename string
                    return `images/installations/${img}`;
                } else if (img && typeof img === 'object') {
                    // New format: object with url and/or filename
                    if (img.url) {
                        // Supabase Storage image - use the full URL
                        return img.url;
                    } else if (img.filename) {
                        // Local image file - prepend images/installations/ path
                        return `images/installations/${img.filename}`;
                    }
                }
                // Fallback
                return `images/installations/${img}`;
            }),
            slug: installation.slug
        }));
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                installations: installations
            })
        };
        
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error: ' + error.message })
        };
    }
};