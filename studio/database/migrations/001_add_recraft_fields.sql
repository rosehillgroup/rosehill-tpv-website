-- Migration: Add Recraft Vector AI fields to studio_jobs table
-- Description: Extends studio_jobs to support Recraft vector generation with retry loop and compliance tracking
-- Date: 2025-01-13
-- Author: TPV Studio

-- Add new columns for Recraft mode
ALTER TABLE studio_jobs
ADD COLUMN IF NOT EXISTS mode_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS width_mm INT,
ADD COLUMN IF NOT EXISTS length_mm INT,
ADD COLUMN IF NOT EXISTS attempt_current INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS attempt_max INT DEFAULT 3,
ADD COLUMN IF NOT EXISTS validation_history JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS compliant BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS all_attempt_urls JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS inspector_final_reasons TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS max_colours INT DEFAULT 6;

-- Add comments to document new columns
COMMENT ON COLUMN studio_jobs.mode_type IS 'Generation mode: recraft_vector (replaces flux_dev and geometric modes)';
COMMENT ON COLUMN studio_jobs.width_mm IS 'Surface width in millimeters';
COMMENT ON COLUMN studio_jobs.length_mm IS 'Surface length/height in millimeters';
COMMENT ON COLUMN studio_jobs.attempt_current IS 'Current retry attempt number (0-indexed)';
COMMENT ON COLUMN studio_jobs.attempt_max IS 'Maximum retries allowed before marking as failed';
COMMENT ON COLUMN studio_jobs.validation_history IS 'Array of validation attempts: [{ attempt, pass, reasons[], correction }]';
COMMENT ON COLUMN studio_jobs.compliant IS 'Final compliance verdict from inspector (true = passes all TPV rules)';
COMMENT ON COLUMN studio_jobs.all_attempt_urls IS 'URLs for all retry attempts: [{ attempt, svg_url, png_url, thumb_url, passed }]';
COMMENT ON COLUMN studio_jobs.inspector_final_reasons IS 'Inspector failure reasons if compliant=false';
COMMENT ON COLUMN studio_jobs.max_colours IS 'Maximum color palette size for this job';

-- Create index on mode_type for faster queries
CREATE INDEX IF NOT EXISTS idx_studio_jobs_mode_type ON studio_jobs(mode_type);

-- Create index on compliant for filtering compliant/non-compliant designs
CREATE INDEX IF NOT EXISTS idx_studio_jobs_compliant ON studio_jobs(compliant) WHERE compliant IS NOT NULL;

-- Update existing jobs to set default mode_type (for backwards compatibility)
UPDATE studio_jobs
SET mode_type =
  CASE
    WHEN metadata->>'mode' = 'flux_dev' THEN 'flux_dev_legacy'
    WHEN metadata->>'mode' = 'mood_board' THEN 'mood_board_legacy'
    WHEN metadata->>'mode' LIKE '%two_pass%' THEN metadata->>'mode' || '_legacy'
    ELSE 'unknown_legacy'
  END
WHERE mode_type IS NULL;

-- Add constraint to ensure attempt_current doesn't exceed attempt_max
ALTER TABLE studio_jobs
ADD CONSTRAINT check_attempt_current_valid
CHECK (attempt_current >= 0 AND attempt_current <= attempt_max);

-- Example validation_history structure (for documentation):
-- [
--   {
--     "attempt": 1,
--     "pass": false,
--     "reasons": ["Contains gradients in multiple shapes", "Detected building/structure"],
--     "correction": "remove all buildings and 3D structures, use flat colours only"
--   },
--   {
--     "attempt": 2,
--     "pass": true,
--     "reasons": []
--   }
-- ]

-- Example all_attempt_urls structure (for documentation):
-- [
--   {
--     "attempt": 1,
--     "svg_url": "https://supabase.co/storage/v1/object/public/studio/recraft/job123/attempt_1/design.svg",
--     "png_url": "https://supabase.co/storage/v1/object/public/studio/recraft/job123/attempt_1/design.png",
--     "thumb_url": "https://supabase.co/storage/v1/object/public/studio/recraft/job123/attempt_1/thumb.png",
--     "passed": false
--   },
--   {
--     "attempt": 2,
--     "svg_url": "https://supabase.co/storage/v1/object/public/studio/recraft/job123/attempt_2/design.svg",
--     "png_url": "https://supabase.co/storage/v1/object/public/studio/recraft/job123/attempt_2/design.png",
--     "thumb_url": "https://supabase.co/storage/v1/object/public/studio/recraft/job123/attempt_2/thumb.png",
--     "passed": true
--   }
-- ]
