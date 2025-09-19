// Admin API for photo submission management
const { createClient } = require('@supabase/supabase-js');

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
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase environment variables not configured');
        return response(500, { error: 'Database service not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle GET requests - retrieve submissions and stats
    if (event.httpMethod === 'GET') {
        try {
            // Get all submissions
            const { data: submissions, error: submissionsError } = await supabase
                .from('photo_submissions')
                .select('*')
                .order('submission_timestamp', { ascending: false });

            if (submissionsError) {
                console.error('Error fetching submissions:', submissionsError);
                return response(500, { error: 'Failed to fetch submissions' });
            }

            // Get statistics
            const { data: stats, error: statsError } = await supabase
                .from('photo_submission_stats')
                .select('*')
                .single();

            if (statsError) {
                console.error('Error fetching stats:', statsError);
                // Continue without stats
            }

            return response(200, {
                success: true,
                submissions: submissions || [],
                stats: stats || {
                    pending_count: 0,
                    approved_count: 0,
                    featured_count: 0,
                    rejected_count: 0,
                    total_count: submissions?.length || 0
                }
            });
        } catch (error) {
            console.error('Handler error:', error);
            return response(500, {
                error: 'An error occurred fetching submissions',
                details: error.message
            });
        }
    }

    // Handle POST requests - update submission status
    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body);
            const { action, submission_id, notes } = body;

            if (!action || !submission_id) {
                return response(400, { error: 'Missing required fields' });
            }

            let result;

            switch (action) {
                case 'approve':
                    const { data: approveData, error: approveError } = await supabase
                        .rpc('approve_photo_submission', {
                            submission_id,
                            approver_email: 'admin@rosehilltpv.com' // You might want to get this from auth
                        });

                    if (approveError) {
                        console.error('Approval error:', approveError);
                        return response(500, { error: 'Failed to approve submission' });
                    }
                    result = approveData;
                    break;

                case 'feature':
                    const { data: featureData, error: featureError } = await supabase
                        .rpc('feature_photo_submission', {
                            submission_id,
                            featured_by_email: 'admin@rosehilltpv.com'
                        });

                    if (featureError) {
                        console.error('Feature error:', featureError);
                        return response(500, { error: 'Failed to feature submission' });
                    }
                    result = featureData;
                    break;

                case 'reject':
                    const { data: rejectData, error: rejectError } = await supabase
                        .rpc('reject_photo_submission', {
                            submission_id,
                            rejection_notes: notes || null
                        });

                    if (rejectError) {
                        console.error('Rejection error:', rejectError);
                        return response(500, { error: 'Failed to reject submission' });
                    }
                    result = rejectData;
                    break;

                default:
                    return response(400, { error: 'Invalid action' });
            }

            return response(200, {
                success: true,
                message: `Submission ${action}ed successfully`,
                result
            });
        } catch (error) {
            console.error('Handler error:', error);
            return response(500, {
                error: 'An error occurred updating submission',
                details: error.message
            });
        }
    }

    // Method not allowed
    return response(405, { error: 'Method not allowed' });
};