// Public API to retrieve approved photos for display
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

// Response helper
const response = (statusCode, body) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
    },
    body: JSON.stringify(body),
});

export const handler = async (event) => {
    // Only accept GET requests
    if (event.httpMethod !== 'GET') {
        return response(405, { error: 'Method not allowed' });
    }

    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase environment variables not configured');
        return response(500, { error: 'Database service not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Parse query parameters
        const params = event.queryStringParameters || {};
        const limit = parseInt(params.limit) || 20;
        const offset = parseInt(params.offset) || 0;
        const featured_only = params.featured === 'true';

        // Build query
        let query = supabase
            .from('approved_photos')
            .select('*');

        // Apply filters
        if (featured_only) {
            query = query.eq('is_featured', true);
        }

        // Apply pagination
        query = query
            .range(offset, offset + limit - 1)
            .order('is_featured', { ascending: false })
            .order('submission_timestamp', { ascending: false });

        // Execute query
        const { data: photos, error: photosError, count } = await query;

        if (photosError) {
            console.error('Error fetching photos:', photosError);
            return response(500, { error: 'Failed to fetch photos' });
        }

        // Format response
        const formattedPhotos = (photos || []).map(photo => ({
            id: photo.id,
            installer_name: photo.installer_name,
            company_name: photo.company_name,
            location: {
                city: photo.location_city,
                country: photo.location_country
            },
            installation_date: photo.installation_date,
            project_name: photo.project_name,
            project_description: photo.project_description,
            products_used: photo.tpv_products_used || [],
            square_meters: photo.square_meters,
            photos: photo.photo_urls || [],
            is_featured: photo.is_featured,
            submission_date: photo.submission_timestamp
        }));

        return response(200, {
            success: true,
            photos: formattedPhotos,
            pagination: {
                limit,
                offset,
                total: count || formattedPhotos.length,
                has_more: formattedPhotos.length === limit
            }
        });
    } catch (error) {
        console.error('Handler error:', error);
        return response(500, {
            error: 'An error occurred fetching photos',
            details: error.message
        });
    }
};