const { createClient } = require('@supabase/supabase-js');
const multipart = require('parse-multipart-data');

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
        
        // Parse multipart form data
        const boundary = event.headers['content-type']?.split('boundary=')[1];
        if (!boundary) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid content type. Expected multipart/form-data.'
                })
            };
        }
        
        const parts = multipart.parse(Buffer.from(event.body, 'base64'), boundary);
        
        // Extract form fields and files
        const formData = {};
        const files = [];
        
        parts.forEach(part => {
            if (part.filename) {
                files.push({
                    filename: part.filename,
                    data: part.data,
                    type: part.type
                });
            } else {
                formData[part.name] = part.data.toString();
            }
        });
        
        // Validate required fields
        const required = ['title', 'location', 'date', 'application', 'descriptions'];
        for (const field of required) {
            if (!formData[field]) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        success: false,
                        error: `Missing required field: ${field}` 
                    })
                };
            }
        }
        
        // Parse descriptions
        let descriptions;
        try {
            descriptions = JSON.parse(formData.descriptions);
        } catch (e) {
            descriptions = [formData.descriptions];
        }
        
        // Upload images to Supabase Storage
        const uploadedImages = [];
        
        for (const file of files) {
            try {
                const filename = `${Date.now()}_${file.filename.replace(/[^a-zA-Z0-9.-]/g, '')}`;
                const filePath = `installations/${filename}`;
                
                const { data, error } = await supabase.storage
                    .from('installation-images')
                    .upload(filePath, file.data, {
                        contentType: file.type
                    });
                
                if (error) {
                    console.error('Upload error:', error);
                    continue;
                }
                
                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('installation-images')
                    .getPublicUrl(filePath);
                
                uploadedImages.push({
                    filename: filename,
                    path: filePath,
                    url: urlData.publicUrl
                });
                
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
        
        // Generate slug
        function generateSlug(title) {
            return title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/[\s-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }
        
        const slug = generateSlug(formData.title) + '-' + Date.now();
        
        // Create installation object
        const installationData = {
            title: formData.title.trim(),
            location: formData.location.trim(),
            installation_date: formData.date,
            application: formData.application,
            description: descriptions,
            images: uploadedImages,
            slug: slug
        };
        
        // Save to database
        const { data, error } = await supabase
            .from('installations')
            .insert([installationData])
            .select();
        
        if (error) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Database error: ' + error.message
                })
            };
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Installation created successfully with images!',
                data: {
                    installation: data[0],
                    images_uploaded: uploadedImages.length
                }
            })
        };
        
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error: ' + error.message
            })
        };
    }
};