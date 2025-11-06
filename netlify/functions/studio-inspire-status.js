// TPV Studio 2.0 - Get Inspire Job Status
// Returns current status of a job (pending, processing, completed, failed)
// Client polls this endpoint until status is 'completed' or 'failed'

import { getSupabaseServiceClient } from './studio/_utils/supabase.js';

/**
 * Get Inspire Job Status Handler
 * GET /api/studio/inspire/status?jobId=<uuid>
 *
 * Response:
 * {
 *   jobId: string,
 *   status: 'pending' | 'processing' | 'completed' | 'failed',
 *   progress: string (optional description),
 *   concepts: [...] (if completed),
 *   metadata: {...} (if completed),
 *   error: string (if failed),
 *   created_at: string,
 *   updated_at: string,
 *   completed_at: string (if completed/failed)
 * }
 */
export const handler = async(event, context) {
  // Only accept GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get jobId from query parameters
    const jobId = event.queryStringParameters?.jobId;

    if (!jobId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'jobId query parameter is required' })
      };
    }

    console.log('[INSPIRE-STATUS] Fetching job:', jobId);

    // Fetch job from database
    const supabase = getSupabaseServiceClient();

    const { data: job, error } = await supabase
      .from('studio_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      console.error('[INSPIRE-STATUS] Database error:', error);

      if (error.code === 'PGRST116') {
        // No rows returned
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Job not found' })
        };
      }

      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Failed to fetch job',
          message: error.message
        })
      };
    }

    console.log('[INSPIRE-STATUS] Job status:', job.status);

    // Build response based on status
    const response = {
      jobId: job.id,
      status: job.status,
      created_at: job.created_at,
      updated_at: job.updated_at
    };

    // Add status-specific fields
    switch (job.status) {
      case 'pending':
        response.message = 'Job is queued and waiting to be processed';
        break;

      case 'processing':
        response.message = 'Job is currently being processed';
        response.progress = 'Generating concepts with SDXL img2img pipeline...';
        break;

      case 'completed':
        response.message = 'Job completed successfully';
        response.concepts = job.concepts;
        response.metadata = job.metadata;
        response.completed_at = job.completed_at;
        break;

      case 'failed':
        response.message = 'Job failed';
        response.error = job.error;
        response.completed_at = job.completed_at;
        response.retry_count = job.retry_count;
        break;

      default:
        response.message = 'Unknown status';
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('[INSPIRE-STATUS] Error:', error);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Status fetch failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
