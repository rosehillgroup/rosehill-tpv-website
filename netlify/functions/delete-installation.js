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
        
        // Parse request body
        const { slug } = JSON.parse(event.body);
        
        if (!slug) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Installation slug is required' })
            };
        }
        
        // First, get the installation to check for images that need to be deleted
        const { data: installation, error: fetchError } = await supabase
            .from('installations')
            .select('*')
            .eq('slug', slug)
            .single();
            
        if (fetchError) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Installation not found' })
            };
        }
        
        // Delete images from Supabase Storage if they exist
        if (installation.images && installation.images.length > 0) {
            const imagesToDelete = installation.images
                .filter(img => img && typeof img === 'object' && img.path)
                .map(img => img.path);
                
            if (imagesToDelete.length > 0) {
                const { error: storageError } = await supabase.storage
                    .from('installation-images')
                    .remove(imagesToDelete);
                    
                if (storageError) {
                    console.error('Error deleting images from storage:', storageError);
                    // Continue with database deletion even if image deletion fails
                }
            }
        }
        
        // Delete the installation from the database
        const { error: deleteError } = await supabase
            .from('installations')
            .delete()
            .eq('slug', slug);
            
        if (deleteError) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to delete installation: ' + deleteError.message })
            };
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Installation deleted successfully'
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