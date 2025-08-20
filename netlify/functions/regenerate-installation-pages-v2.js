/**
 * Self-contained Netlify Function to regenerate installation pages
 * Includes all necessary logic without external dependencies
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

exports.handler = async (event, context) => {
    console.log('Installation page regeneration function triggered');

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the webhook payload
        let payload;
        try {
            payload = JSON.parse(event.body);
        } catch (error) {
            console.error('Invalid JSON payload:', error);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid JSON payload' })
            };
        }

        console.log('Webhook payload received:', {
            type: payload.type,
            table: payload.table,
            schema: payload.schema
        });

        // Verify this is an installations table webhook
        if (payload.table !== 'installations') {
            console.log('Ignoring webhook for table:', payload.table);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Webhook ignored - not installations table' })
            };
        }

        // Only process INSERT and UPDATE events
        if (!['INSERT', 'UPDATE'].includes(payload.type)) {
            console.log('Ignoring webhook type:', payload.type);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Webhook ignored - not INSERT or UPDATE' })
            };
        }

        // Initialize Supabase client
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase configuration');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        
        console.log('Triggering rebuild via Netlify Build Hook...');

        // Trigger a full site rebuild which will regenerate all installation pages
        if (process.env.NETLIFY_BUILD_HOOK) {
            try {
                const buildResponse = await fetch(process.env.NETLIFY_BUILD_HOOK, {
                    method: 'POST'
                });
                
                if (buildResponse.ok) {
                    console.log('Netlify build triggered successfully');
                    
                    return {
                        statusCode: 200,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            success: true,
                            message: 'Netlify rebuild triggered - installation pages will be regenerated',
                            timestamp: new Date().toISOString()
                        })
                    };
                } else {
                    console.warn('Failed to trigger Netlify build:', buildResponse.status);
                    throw new Error(`Build trigger failed: ${buildResponse.status}`);
                }
            } catch (buildError) {
                console.error('Error triggering Netlify build:', buildError);
                throw new Error(`Failed to trigger rebuild: ${buildError.message}`);
            }
        } else {
            // If no build hook is configured, we can't regenerate pages automatically
            console.warn('No NETLIFY_BUILD_HOOK configured - cannot regenerate pages');
            
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    message: 'No build hook configured - manual regeneration required',
                    instructions: 'Please run: node generate-installation-pages-supabase.cjs',
                    timestamp: new Date().toISOString()
                })
            };
        }

    } catch (error) {
        console.error('Error in regenerate-installation-pages function:', error);

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: 'Internal server error',
                message: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};