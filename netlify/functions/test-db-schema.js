// Test database schema for Flux Dev migration
const { getSupabaseServiceClient } = require('./studio/_utils/supabase.js');

exports.handler = async (event, context) => {
  try {
    const supabase = getSupabaseServiceClient();

    console.log('[TEST] Testing database schema...');

    // Try to insert a test job with new schema
    const testJob = {
      status: 'pending',
      prompt: 'test prompt',
      surface: { width_mm: 5000, height_mm: 5000 },
      max_colours: 6,
      try_simpler: false,
      metadata: {
        mode: 'flux_dev',
        test: true
      }
    };

    console.log('[TEST] Attempting to insert test job:', JSON.stringify(testJob, null, 2));

    const { data, error } = await supabase
      .from('studio_jobs')
      .insert(testJob)
      .select()
      .single();

    if (error) {
      console.error('[TEST] Insert failed:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: error.message,
          details: error,
          hint: 'Database migration may not have been applied correctly'
        })
      };
    }

    console.log('[TEST] Insert successful! Job ID:', data.id);

    // Clean up test job
    await supabase.from('studio_jobs').delete().eq('id', data.id);
    console.log('[TEST] Test job cleaned up');

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Database schema is correct!',
        jobId: data.id
      })
    };

  } catch (error) {
    console.error('[TEST] Exception:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      })
    };
  }
};
