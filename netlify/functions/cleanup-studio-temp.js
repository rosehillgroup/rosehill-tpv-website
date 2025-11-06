// TPV Studio - Temp Storage Cleanup
// Scheduled function to delete expired temp files (24h TTL)
// Configure in netlify.toml: @daily or @hourly

exports.handler = async (event, context) => {
  const { getSupabaseServiceClient } = await import('./studio/_utils/supabase.mjs');

  try {
    console.log('[CLEANUP] Starting temp storage cleanup');

    const supabase = getSupabaseServiceClient();

    // Calculate cutoff time (24h ago + 1h grace period)
    const cutoffHours = parseInt(process.env.TEMP_TTL_HOURS || '24');
    const gracePeriodHours = 1;
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - (cutoffHours + gracePeriodHours));

    console.log(`[CLEANUP] Cutoff time: ${cutoffTime.toISOString()} (${cutoffHours + gracePeriodHours}h ago)`);

    // List all files in studio/temp/ path
    const bucketName = 'tpv-studio';
    const tempPrefix = 'studio/temp/';

    // Get list of temp files
    const { data: files, error: listError } = await supabase
      .storage
      .from(bucketName)
      .list(tempPrefix, {
        limit: 1000, // Process in batches
        sortBy: { column: 'created_at', order: 'asc' }
      });

    if (listError) {
      console.error('[CLEANUP] Error listing files:', listError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to list files', detail: listError.message })
      };
    }

    if (!files || files.length === 0) {
      console.log('[CLEANUP] No temp files found');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No files to clean', deleted: 0 })
      };
    }

    console.log(`[CLEANUP] Found ${files.length} temp directories/files`);

    // Collect expired files recursively
    const expiredFiles = [];

    for (const item of files) {
      // If it's a directory (date folder like 20250327), list its contents
      if (item.id === null) {
        // List files in this date directory
        const datePath = `${tempPrefix}${item.name}/`;
        const { data: dateFiles } = await supabase
          .storage
          .from(bucketName)
          .list(datePath, {
            limit: 1000
          });

        if (dateFiles) {
          for (const dateItem of dateFiles) {
            // Check if it's expired
            const createdAt = new Date(dateItem.created_at);
            if (createdAt < cutoffTime) {
              // Build full path
              if (dateItem.id === null) {
                // It's a job directory, list its contents
                const jobPath = `${datePath}${dateItem.name}/`;
                const { data: jobFiles } = await supabase
                  .storage
                  .from(bucketName)
                  .list(jobPath, {
                    limit: 1000
                  });

                if (jobFiles) {
                  for (const jobFile of jobFiles) {
                    if (jobFile.id !== null) {
                      expiredFiles.push(`${jobPath}${jobFile.name}`);
                    }
                  }
                }
              } else {
                // It's a file directly in date directory
                expiredFiles.push(`${datePath}${dateItem.name}`);
              }
            }
          }
        }
      }
    }

    console.log(`[CLEANUP] Found ${expiredFiles.length} expired files to delete`);

    if (expiredFiles.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No expired files', deleted: 0 })
      };
    }

    // Delete files in batches (Supabase allows array of paths)
    let deletedCount = 0;
    const batchSize = 100;

    for (let i = 0; i < expiredFiles.length; i += batchSize) {
      const batch = expiredFiles.slice(i, i + batchSize);

      const { data: deletedData, error: deleteError } = await supabase
        .storage
        .from(bucketName)
        .remove(batch);

      if (deleteError) {
        console.error(`[CLEANUP] Error deleting batch ${i / batchSize + 1}:`, deleteError);
      } else {
        deletedCount += batch.length;
        console.log(`[CLEANUP] Deleted batch ${i / batchSize + 1}: ${batch.length} files`);
      }
    }

    // Clean up old webhook logs (keep last 7 days)
    const webhookCutoff = new Date();
    webhookCutoff.setDate(webhookCutoff.getDate() - 7);

    const { error: webhookError } = await supabase
      .from('studio_webhooks')
      .delete()
      .lt('received_at', webhookCutoff.toISOString());

    if (webhookError) {
      console.error('[CLEANUP] Error deleting old webhook logs:', webhookError);
    } else {
      console.log('[CLEANUP] Cleaned up webhook logs older than 7 days');
    }

    // Clean up old failed jobs (keep last 30 days)
    const jobCutoff = new Date();
    jobCutoff.setDate(jobCutoff.getDate() - 30);

    const { error: jobError } = await supabase
      .from('studio_jobs')
      .delete()
      .eq('status', 'failed')
      .lt('created_at', jobCutoff.toISOString());

    if (jobError) {
      console.error('[CLEANUP] Error deleting old failed jobs:', jobError);
    } else {
      console.log('[CLEANUP] Cleaned up failed jobs older than 30 days');
    }

    console.log(`[CLEANUP] Cleanup complete. Deleted ${deletedCount} files`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Cleanup complete',
        deleted: deletedCount,
        cutoffTime: cutoffTime.toISOString()
      })
    };

  } catch (error) {
    console.error('[CLEANUP ERROR]', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
