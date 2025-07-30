const { createClient } = require('@supabase/supabase-js');
const { verifyToken } = require('./utils/auth');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    
    // Check authentication
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const authResult = verifyToken(authHeader);
    
    if (!authResult.valid) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ success: false, error: authResult.error })
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
        
        // Parse multipart form data with custom parser
        let boundary;
        let bodyBuffer;
        
        try {
            // Get boundary from content-type header
            const contentType = event.headers['content-type'] || event.headers['Content-Type'];
            boundary = contentType?.split('boundary=')[1];
            
            if (!boundary) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'Invalid content type. Expected multipart/form-data.',
                        debug: {
                            content_type: contentType,
                            headers: Object.keys(event.headers)
                        }
                    })
                };
            }
            
            // Parse body - handle both base64 and raw formats
            if (event.isBase64Encoded) {
                bodyBuffer = Buffer.from(event.body, 'base64');
            } else {
                bodyBuffer = Buffer.from(event.body, 'binary');
            }
            
        } catch (parseError) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Failed to parse request: ' + parseError.message,
                    debug: {
                        isBase64: event.isBase64Encoded,
                        bodyLength: event.body?.length || 0
                    }
                })
            };
        }
        
        // Custom multipart parser (same as create function)
        function parseMultipart(buffer, boundary) {
            const boundaryStr = '--' + boundary;
            const parts = [];
            
            // Split by boundary
            const sections = buffer.toString('binary').split(boundaryStr);
            
            for (let i = 1; i < sections.length - 1; i++) {
                const section = sections[i];
                if (!section.trim()) continue;
                
                // Find the double newline that separates headers from body
                const headerEndIndex = section.indexOf('\r\n\r\n');
                if (headerEndIndex === -1) continue;
                
                const headersStr = section.substring(0, headerEndIndex);
                const bodyStr = section.substring(headerEndIndex + 4);
                
                // Parse headers
                const headers = {};
                const headerLines = headersStr.split('\r\n');
                
                for (const line of headerLines) {
                    if (!line.trim()) continue;
                    const colonIndex = line.indexOf(':');
                    if (colonIndex > 0) {
                        const key = line.substring(0, colonIndex).trim().toLowerCase();
                        const value = line.substring(colonIndex + 1).trim();
                        headers[key] = value;
                    }
                }
                
                // Extract name and filename from Content-Disposition
                const disposition = headers['content-disposition'] || '';
                const nameMatch = disposition.match(/name="([^"]+)"/);
                const filenameMatch = disposition.match(/filename="([^"]+)"/);
                
                const part = {
                    name: nameMatch ? nameMatch[1] : '',
                    filename: filenameMatch ? filenameMatch[1] : null,
                    type: headers['content-type'] || 'text/plain',
                    data: Buffer.from(bodyStr, 'binary')
                };
                
                parts.push(part);
            }
            
            return parts;
        }
        
        let parts;
        try {
            parts = parseMultipart(bodyBuffer, boundary);
        } catch (multipartError) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Failed to parse multipart data: ' + multipartError.message
                })
            };
        }
        
        // Extract form fields and files
        const formData = {};
        const files = [];
        
        if (!parts || parts.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'No form data found in request'
                })
            };
        }
        
        parts.forEach((part, index) => {
            try {
                if (part.filename) {
                    files.push({
                        filename: part.filename,
                        data: part.data,
                        type: part.type
                    });
                } else {
                    formData[part.name] = part.data.toString().trim();
                }
            } catch (partError) {
                console.error(`Error processing part ${index}:`, partError);
            }
        });
        
        console.log('Update form data keys:', Object.keys(formData));
        console.log('Update files count:', files.length);
        console.log('Form data values:', formData);
        
        // Validate required fields
        const required = ['slug', 'title', 'location', 'date', 'application', 'descriptions'];
        const missing = [];
        
        for (const field of required) {
            if (!formData[field] || formData[field].trim() === '') {
                missing.push(field);
            }
        }
        
        if (missing.length > 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: `Missing required fields: ${missing.join(', ')}`,
                    debug: {
                        received_fields: Object.keys(formData),
                        missing_fields: missing
                    }
                })
            };
        }
        
        // Get existing installation to preserve current images
        console.log('Looking for installation with slug:', formData.slug);
        const { data: existingData, error: fetchError } = await supabase
            .from('installations')
            .select('*')
            .eq('slug', formData.slug)
            .single();
        
        console.log('Supabase query result:', { data: existingData, error: fetchError });
        
        if (fetchError || !existingData) {
            console.log('Installation not found. Error:', fetchError);
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Installation not found',
                    debug: {
                        slug: formData.slug,
                        supabaseError: fetchError?.message,
                        foundData: !!existingData
                    }
                })
            };
        }
        
        // Parse descriptions
        let descriptions;
        try {
            descriptions = JSON.parse(formData.descriptions);
        } catch (e) {
            descriptions = [formData.descriptions];
        }
        
        // Handle image updates - ensure images is always an array
        let currentImages = [];
        if (existingData.images) {
            // Handle both array and object formats
            if (Array.isArray(existingData.images)) {
                currentImages = existingData.images;
            } else if (typeof existingData.images === 'object') {
                // Convert object to array if needed
                currentImages = Object.values(existingData.images);
            }
        }
        let updatedImages = [...currentImages];
        
        // Parse images to remove (if any)
        let imagesToRemove = [];
        try {
            imagesToRemove = formData.imagesToRemove ? JSON.parse(formData.imagesToRemove) : [];
        } catch (parseError) {
            console.error('Error parsing imagesToRemove:', parseError);
            imagesToRemove = [];
        }
        
        // Remove specified images
        if (imagesToRemove.length > 0) {
            updatedImages = updatedImages.filter(img => {
                const imageUrl = typeof img === 'string' ? img : img.url;
                return !imagesToRemove.includes(imageUrl);
            });
            
            // Delete removed images from Supabase Storage
            for (const imageToRemove of imagesToRemove) {
                if (imageToRemove.includes('supabase.co')) {
                    try {
                        const pathMatch = imageToRemove.match(/\/installations\/(.+)$/);
                        if (pathMatch) {
                            await supabase.storage
                                .from('installation-images')
                                .remove([`installations/${pathMatch[1]}`]);
                        }
                    } catch (deleteError) {
                        console.error('Error deleting image:', deleteError);
                    }
                }
            }
        }
        
        // Upload new images to Supabase Storage
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
                
                updatedImages.push({
                    filename: filename,
                    path: filePath,
                    url: urlData.publicUrl
                });
                
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
        
        // Prepare updated installation object
        const updatedInstallation = {
            title: formData.title.trim(),
            location: formData.location.trim(),
            installation_date: formData.date,
            application: formData.application,
            description: descriptions,
            images: updatedImages
        };
        
        // Update installation in database
        const { data, error } = await supabase
            .from('installations')
            .update(updatedInstallation)
            .eq('slug', formData.slug)
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
        
        console.log('✅ Installation updated successfully');
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Installation updated successfully!',
                data: {
                    installation: data[0],
                    images_total: updatedImages.length,
                    images_added: files.length,
                    images_removed: imagesToRemove.length
                }
            })
        };
        
    } catch (error) {
        console.error('Update function error:', error);
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