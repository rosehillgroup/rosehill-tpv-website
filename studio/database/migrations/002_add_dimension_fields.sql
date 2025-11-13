-- HOTFIX Migration: Add dimension fields to studio_jobs
-- Description: Adds width_mm and length_mm columns that were missing from initial migration
-- Date: 2025-01-13
-- Priority: CRITICAL - Must run immediately to fix production error

-- Add dimension columns
ALTER TABLE studio_jobs
ADD COLUMN IF NOT EXISTS width_mm INT,
ADD COLUMN IF NOT EXISTS length_mm INT;

-- Add comments
COMMENT ON COLUMN studio_jobs.width_mm IS 'Surface width in millimeters';
COMMENT ON COLUMN studio_jobs.length_mm IS 'Surface length/height in millimeters';

-- Verify columns exist (for troubleshooting)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'studio_jobs'
    AND column_name IN ('width_mm', 'length_mm')
  ) THEN
    RAISE NOTICE 'SUCCESS: Dimension columns added to studio_jobs table';
  ELSE
    RAISE EXCEPTION 'FAILED: Columns not found after migration';
  END IF;
END $$;
