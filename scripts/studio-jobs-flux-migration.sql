-- ============================================================================
-- TPV Studio - Flux Dev Migration Schema Update
-- ============================================================================
-- Adds columns for new Flux Dev pipeline with QC auto-retry and max_colours
-- Run this in Supabase SQL Editor before deploying new code
-- ============================================================================

-- Add new columns to studio_jobs table
ALTER TABLE studio_jobs
  ADD COLUMN IF NOT EXISTS max_colours INTEGER DEFAULT 6
    CHECK (max_colours >= 1 AND max_colours <= 8),
  ADD COLUMN IF NOT EXISTS qc_results JSONB,
  ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS try_simpler BOOLEAN DEFAULT false;

-- Add comment documentation
COMMENT ON COLUMN studio_jobs.max_colours IS 'Maximum colours allowed in design (1-8, default 6)';
COMMENT ON COLUMN studio_jobs.qc_results IS 'Quality control check results: {pass, region_count, colour_count, min_feature_mm, min_radius_mm, score}';
COMMENT ON COLUMN studio_jobs.retry_count IS 'Number of times job has been retried (for QC auto-retry)';
COMMENT ON COLUMN studio_jobs.try_simpler IS 'Flag indicating this is a "Try Simpler" regeneration with stricter parameters';

-- Create index on retry_count for monitoring
CREATE INDEX IF NOT EXISTS idx_studio_jobs_retry_count
  ON studio_jobs(retry_count)
  WHERE retry_count > 0;

-- Create index on qc_results pass status for analytics
CREATE INDEX IF NOT EXISTS idx_studio_jobs_qc_pass
  ON studio_jobs((qc_results->>'pass'))
  WHERE qc_results IS NOT NULL;

-- ============================================================================
-- Migration verification queries
-- ============================================================================

-- Check columns were added successfully
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'studio_jobs'
  AND column_name IN ('max_colours', 'qc_results', 'retry_count', 'try_simpler')
ORDER BY column_name;

-- Sample query to verify structure
SELECT
  id,
  status,
  max_colours,
  retry_count,
  try_simpler,
  qc_results,
  created_at
FROM studio_jobs
LIMIT 1;

-- ============================================================================
-- Rollback (if needed)
-- ============================================================================
-- To rollback this migration, run:
--
-- ALTER TABLE studio_jobs
--   DROP COLUMN IF EXISTS max_colours,
--   DROP COLUMN IF EXISTS qc_results,
--   DROP COLUMN IF EXISTS retry_count,
--   DROP COLUMN IF EXISTS try_simpler;
--
-- DROP INDEX IF EXISTS idx_studio_jobs_retry_count;
-- DROP INDEX IF EXISTS idx_studio_jobs_qc_pass;
-- ============================================================================
