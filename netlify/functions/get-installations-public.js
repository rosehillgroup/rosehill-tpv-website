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
        const language = event.queryStringParameters?.lang || 'en';
        
        // Language-aware field selection
        const getSelectFields = (lang) => {
            const baseFields = 'id, title, location, installation_date, application, description, images, slug';
            if (lang === 'en') return baseFields;
            
            const translatedFields = `title_${lang}, description_${lang}`;
            return `${baseFields}, ${translatedFields}`;
        };
        
        if (slug) {
            // Get specific installation
            console.log('Fetching installation with slug:', slug, 'language:', language);
            const { data: installation, error } = await supabase
                .from('installations')
                .select(getSelectFields(language))
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
            
            // Apply language-specific content and map fields for frontend compatibility
            const getLocalizedContent = (installation, lang) => {
                let title = installation.title;
                let description = installation.description;
                
                if (lang !== 'en') {
                    const titleKey = `title_${lang}`;
                    const descKey = `description_${lang}`;
                    title = installation[titleKey] || installation.title;
                    description = installation[descKey] || installation.description;
                }
                
                return { title, description };
            };
            
            const localizedContent = getLocalizedContent(installation, language);
            const mappedInstallation = {
                ...installation,
                title: localizedContent.title,
                description: localizedContent.description,
                date: installation.installation_date,
                images: installation.images?.map(img => 
                    typeof img === 'object' && img.url ? img.url : img
                ) || []
            };
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ installation: mappedInstallation })
            };
        } else {
            // Get all installations for public display
            console.log('Fetching all installations for language:', language);
            const { data: installations, error } = await supabase
                .from('installations')
                .select(getSelectFields(language))
                .order('installation_date', { ascending: false });
                
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
            
            // Apply language-specific content and map fields for frontend compatibility
            const getLocalizedContent = (installation, lang) => {
                let title = installation.title;
                let description = installation.description;
                
                if (lang !== 'en') {
                    const titleKey = `title_${lang}`;
                    const descKey = `description_${lang}`;
                    title = installation[titleKey] || installation.title;
                    description = installation[descKey] || installation.description;
                }
                
                return { title, description };
            };
            
            const mappedInstallations = installations?.map(installation => {
                const localizedContent = getLocalizedContent(installation, language);
                return {
                    ...installation,
                    title: localizedContent.title,
                    description: localizedContent.description,
                    date: installation.installation_date,
                    images: installation.images?.map(img => 
                        typeof img === 'object' && img.url ? img.url : img
                    ) || []
                };
            }) || [];
            
            console.log('Returning successful response with', mappedInstallations.length, 'installations');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ installations: mappedInstallations })
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