/**
 * Netlify Function to automatically regenerate installation pages
 * Triggered by Supabase webhook when installations are added/updated
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing required environment variables for Supabase');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Netlify Function Handler
 */
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

        console.log('Processing installation page regeneration...');

        // Generate installation pages by calling the script directly
        const { execSync } = require('child_process');
        
        try {
            const scriptPath = path.join(__dirname, '../../generate-installation-pages-supabase.cjs');
            const env = {
                ...process.env,
                SUPABASE_URL: supabaseUrl,
                SUPABASE_ANON_KEY: supabaseKey
            };
            
            const result = execSync(`node ${scriptPath}`, { 
                env,
                encoding: 'utf8',
                cwd: path.join(__dirname, '../..')
            });
            
            console.log('Script output:', result);
            console.log('Installation pages regenerated successfully');
            
        } catch (scriptError) {
            console.error('Error running generation script:', scriptError);
            throw new Error(`Failed to regenerate pages: ${scriptError.message}`);
        }

        // Optional: Trigger Netlify build to deploy changes
        if (process.env.NETLIFY_BUILD_HOOK) {
            try {
                const buildResponse = await fetch(process.env.NETLIFY_BUILD_HOOK, {
                    method: 'POST'
                });
                
                if (buildResponse.ok) {
                    console.log('Netlify build triggered successfully');
                } else {
                    console.warn('Failed to trigger Netlify build:', buildResponse.status);
                }
            } catch (buildError) {
                console.error('Error triggering Netlify build:', buildError);
            }
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'Installation pages regenerated successfully',
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Error in regenerate-installation-pages function:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                error: 'Internal server error',
                message: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};

/**
 * Helper function to verify webhook signature (optional security)
 */
function verifyWebhookSignature(payload, signature, secret) {
    if (!secret || !signature) {
        return true; // Skip verification if not configured
    }

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const computedSignature = `sha256=${hmac.digest('hex')}`;

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(computedSignature)
    );
}