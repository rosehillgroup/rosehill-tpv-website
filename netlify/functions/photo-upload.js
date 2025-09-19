// Netlify function to handle photo uploads from TPV installers
const { createClient } = require('@supabase/supabase-js');
const busboy = require('busboy');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

// Response helper
const response = (statusCode, body) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
});

exports.handler = async (event) => {
    try {
        console.log('Function started, method:', event.httpMethod);

        // Only accept POST requests
        if (event.httpMethod !== 'POST') {
            return response(405, { error: 'Method not allowed' });
        }

        // Check if Supabase is configured
        console.log('Checking Supabase config...');
        if (!supabaseUrl || !supabaseKey) {
            console.error('Supabase environment variables not configured');
            console.error('supabaseUrl:', !!supabaseUrl, 'supabaseKey:', !!supabaseKey);
            return response(500, { error: 'Storage service not configured' });
        }

        console.log('Creating Supabase client...');
        const supabase = createClient(supabaseUrl, supabaseKey);

        console.log('Parsing multipart form data...');
        // Parse multipart form data
        const formData = await parseMultipartForm(event);
        console.log('Form data parsed successfully, fields:', Object.keys(formData.fields), 'files:', formData.files.length);

        // Validate required fields
        if (!formData.fields.installer_name || !formData.fields.email) {
            return response(400, { error: 'Missing required fields' });
        }

        if (!formData.fields.terms_accepted || formData.fields.terms_accepted !== 'on') {
            return response(400, { error: 'Terms must be accepted' });
        }

        if (formData.files.length === 0) {
            return response(400, { error: 'No photos provided' });
        }

        // Upload photos to Supabase Storage
        const photoUrls = [];
        const uploadErrors = [];

        for (const file of formData.files) {
            try {
                // Generate unique filename
                const timestamp = Date.now();
                const randomId = Math.random().toString(36).substring(7);
                const extension = file.filename.split('.').pop();
                const fileName = `${timestamp}-${randomId}.${extension}`;
                const filePath = `uploads/${new Date().getFullYear()}/${fileName}`;

                // Upload to Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('tpv-photos')
                    .upload(filePath, file.data, {
                        contentType: file.mimeType,
                        upsert: false,
                    });

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    uploadErrors.push(`Failed to upload ${file.filename}`);
                } else {
                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('tpv-photos')
                        .getPublicUrl(filePath);

                    photoUrls.push(publicUrl);
                }
            } catch (error) {
                console.error('File upload error:', error);
                uploadErrors.push(`Error uploading ${file.filename}`);
            }
        }

        // Check if any photos were successfully uploaded
        if (photoUrls.length === 0) {
            return response(500, {
                error: 'Failed to upload photos',
                details: uploadErrors
            });
        }

        // Parse products used (JSON string from frontend)
        let productsUsed = [];
        try {
            if (formData.fields.products_used) {
                productsUsed = JSON.parse(formData.fields.products_used);
            }
        } catch (e) {
            console.warn('Could not parse products_used:', e);
        }

        // Prepare submission data
        const submissionData = {
            installer_name: formData.fields.installer_name,
            company_name: formData.fields.company_name || null,
            email: formData.fields.email,
            phone: formData.fields.phone || null,
            location_city: formData.fields.location_city || null,
            location_country: formData.fields.location_country || null,
            installation_date: formData.fields.installation_date || null,
            project_name: formData.fields.project_name || null,
            project_description: formData.fields.project_description || null,
            tpv_products_used: productsUsed,
            square_meters: formData.fields.square_meters ? parseInt(formData.fields.square_meters) : null,
            photo_urls: photoUrls,
            terms_accepted: true,
            submission_ip: event.headers['client-ip'] || event.headers['x-forwarded-for'] || null,
            metadata: {
                source: 'qr_code',
                user_agent: event.headers['user-agent'] || null,
                upload_count: photoUrls.length,
                upload_errors: uploadErrors.length,
            }
        };

        // Insert submission into database
        const { data: submission, error: dbError } = await supabase
            .from('photo_submissions')
            .insert([submissionData])
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            return response(500, {
                error: 'Failed to save submission',
                details: dbError.message
            });
        }

        // Send notification email (optional - implement if needed)
        // await sendNotificationEmail(submissionData);

        return response(200, {
            success: true,
            message: 'Photos uploaded successfully',
            submission_id: submission.id,
            photos_uploaded: photoUrls.length,
            upload_errors: uploadErrors
        });

    } catch (error) {
        console.error('Handler error:', error);
        console.error('Error stack:', error.stack);
        return response(500, {
            error: 'An error occurred processing your submission',
            details: error.message
        });
    } catch (criticalError) {
        // Catch any errors in error handling itself
        console.error('Critical error in handler:', criticalError);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Critical system error',
                details: criticalError.message
            }),
        };
    }
};

// Parse multipart form data using busboy
function parseMultipartForm(event) {
    return new Promise((resolve, reject) => {
        try {
            const fields = {};
            const files = [];

            console.log('parseMultipartForm: Starting...');
            console.log('Content-Type:', event.headers['content-type'] || event.headers['Content-Type']);
            console.log('isBase64Encoded:', event.isBase64Encoded);

            // Decode base64 body if needed
            const contentType = event.headers['content-type'] || event.headers['Content-Type'];
            const body = event.isBase64Encoded
                ? Buffer.from(event.body, 'base64')
                : event.body;

            console.log('Body type:', typeof body, 'length:', body?.length);

        const bb = busboy({
            headers: {
                'content-type': contentType,
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit per file
                files: 10, // Max 10 files
            }
        });

        bb.on('file', (name, file, info) => {
            const { filename, mimeType } = info;
            const chunks = [];

            file.on('data', (chunk) => {
                chunks.push(chunk);
            });

            file.on('end', () => {
                files.push({
                    fieldname: name,
                    filename,
                    mimeType,
                    data: Buffer.concat(chunks),
                });
            });

            file.on('error', (error) => {
                console.error('File stream error:', error);
            });
        });

        bb.on('field', (name, value) => {
            fields[name] = value;
        });

        bb.on('finish', () => {
            resolve({ fields, files });
        });

        bb.on('error', (error) => {
            console.error('Busboy error:', error);
            reject(error);
        });

        // Write data to busboy
        console.log('Writing data to busboy...');
        if (typeof body === 'string') {
            bb.write(Buffer.from(body, 'binary'));
        } else {
            bb.write(body);
        }
        bb.end();

        } catch (parseError) {
            console.error('parseMultipartForm error:', parseError);
            reject(parseError);
        }
    });
}