const { createClient } = require('@supabase/supabase-js');
const multipart = require('parse-multipart-data');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Utility functions
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function sanitizeFilename(filename) {
    const ext = filename.split('.').pop();
    const name = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, '');
    return `${Date.now()}_${name}.${ext}`;
}

async function uploadImages(files) {
    const uploadedImages = [];
    
    for (const file of files) {
        try {
            const filename = sanitizeFilename(file.filename);
            const filePath = `installations/${filename}`;
            
            // Upload to Supabase Storage
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
    
    return uploadedImages;
}

async function saveInstallation(installationData) {
    const { data, error } = await supabase
        .from('installations')
        .insert([installationData])
        .select();
    
    if (error) {
        throw new Error('Database error: ' + error.message);
    }
    
    return data[0];
}

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };
    
    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ 
                success: false,
                error: 'Method not allowed' 
            })
        };
    }
    
    try {
        // Check if Supabase is configured
        if (!supabaseUrl || !supabaseKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Database not configured. Please set up Supabase environment variables.'
                })
            };
        }
        
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
        
        // Extract form fields
        const formData = {};
        const files = [];
        
        parts.forEach(part => {
            if (part.filename) {
                // This is a file
                files.push({
                    filename: part.filename,
                    data: part.data,
                    type: part.type
                });
            } else {
                // This is a form field
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
        
        // Validate files
        if (files.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'At least one image is required' 
                })
            };
        }
        
        // Parse descriptions
        let descriptions;
        try {
            descriptions = JSON.parse(formData.descriptions);
        } catch (e) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Invalid descriptions format' 
                })
            };
        }
        
        // Upload images
        const uploadedImages = await uploadImages(files);
        if (uploadedImages.length === 0) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Failed to upload images' 
                })
            };
        }
        
        // Generate slug
        const slug = generateSlug(formData.title);
        
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
        const savedInstallation = await saveInstallation(installationData);
        
        // Success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Installation created successfully',
                data: {
                    id: savedInstallation.id,
                    slug: slug,
                    images_uploaded: uploadedImages.length,
                    installation: savedInstallation
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