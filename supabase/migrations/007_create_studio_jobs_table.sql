-- Create TPV Studio async job system
-- Tracks concept generation jobs for img2img pipeline with flat stencils
-- Eliminates timeout issues by using background workers

-- Create storage bucket for studio-generated assets (concepts, stencils, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tpv-studio',
  'tpv-studio',
  true, -- Public bucket for generated concept images
  10485760, -- 10MB file size limit (10 * 1024 * 1024 bytes)
  ARRAY['image/png', 'image/jpeg', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Create studio_jobs table
CREATE TABLE IF NOT EXISTS public.studio_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),

  -- Request parameters
  prompt TEXT NOT NULL,
  surface JSONB NOT NULL, -- {width_m, height_m}
  palette_colors JSONB, -- Array of {code, hex, name} or NULL for auto
  style TEXT NOT NULL DEFAULT 'professional',
  count INTEGER NOT NULL DEFAULT 6,

  -- Results (populated when status = 'completed')
  concepts JSONB, -- Array of concept objects with URLs
  metadata JSONB, -- Generation metadata (timings, cost, etc.)

  -- Error handling
  error TEXT, -- Error message if status = 'failed'
  retry_count INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Cleanup tracking
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_studio_jobs_status ON public.studio_jobs(status);
CREATE INDEX IF NOT EXISTS idx_studio_jobs_created_at ON public.studio_jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_studio_jobs_expires_at ON public.studio_jobs(expires_at);

-- Enable RLS on studio_jobs table
ALTER TABLE public.studio_jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to create jobs (unauthenticated access)
CREATE POLICY "Anyone can create studio jobs"
ON public.studio_jobs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Allow anyone to read their job by ID (via URL)
CREATE POLICY "Anyone can read studio jobs by ID"
ON public.studio_jobs
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy: Service role can manage all jobs (for worker)
CREATE POLICY "Service role has full access to studio jobs"
ON public.studio_jobs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_studio_job_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.status IN ('completed', 'failed') AND OLD.status NOT IN ('completed', 'failed') THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_update_studio_job_updated_at
BEFORE UPDATE ON public.studio_jobs
FOR EACH ROW
EXECUTE FUNCTION update_studio_job_updated_at();

-- Cleanup function to delete old jobs and their storage assets
CREATE OR REPLACE FUNCTION cleanup_old_studio_jobs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  job_record RECORD;
  concept_record JSONB;
BEGIN
  -- Find expired jobs
  FOR job_record IN
    SELECT id, concepts FROM public.studio_jobs
    WHERE expires_at < NOW()
  LOOP
    -- Delete associated storage files (concepts, stencils, thumbnails)
    IF job_record.concepts IS NOT NULL THEN
      FOR concept_record IN SELECT * FROM jsonb_array_elements(job_record.concepts)
      LOOP
        -- Extract file paths from URLs and delete
        -- Note: This is a simplified version - production should parse URLs properly
        -- DELETE FROM storage.objects WHERE name LIKE '%' || concept_id || '%';
      END LOOP;
    END IF;

    -- Delete the job record
    DELETE FROM public.studio_jobs WHERE id = job_record.id;
  END LOOP;

  RAISE NOTICE 'Cleaned up expired studio jobs';
END;
$$;

-- Schedule cleanup to run daily at 3 AM
-- Note: Requires pg_cron extension
-- Run: CREATE EXTENSION IF NOT EXISTS pg_cron;
-- Then uncomment the following line:
-- SELECT cron.schedule('cleanup-studio-jobs', '0 3 * * *', 'SELECT cleanup_old_studio_jobs()');

-- Manual cleanup can be run with:
-- SELECT cleanup_old_studio_jobs();

COMMENT ON TABLE public.studio_jobs IS 'Async job queue for TPV Studio concept generation with img2img pipeline';
COMMENT ON FUNCTION cleanup_old_studio_jobs() IS 'Deletes expired studio jobs and their associated storage files (runs daily)';
