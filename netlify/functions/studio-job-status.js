// TPV Studio - Get Job Status
// Polls studio_jobs table for job status

exports.handler = async (event, context) => {
  // Dynamic import of ESM utilities
  const { getSupabaseServiceClient } = await import('./studio/_utils/supabase.mjs');

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const jobId = event.queryStringParameters?.jobId;

    if (!jobId) {
      throw new Error('jobId parameter is required');
    }

    const supabase = getSupabaseServiceClient();

    // Get job status
    const { data: job, error } = await supabase
      .from('studio_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) throw error;
    if (!job) throw new Error('Job not found');

    // Return status
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId: job.id,
        status: job.status,
        result: job.result,
        error: job.error,
        metadata: job.metadata
      })
    };

  } catch (error) {
    console.error('[JOB-STATUS ERROR]', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
