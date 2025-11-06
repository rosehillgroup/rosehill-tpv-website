-- Migration 008: Webhook Pattern Schema Changes
-- Adds columns for Replicate webhook integration and job lifecycle tracking

-- Add prediction_id for tracking Replicate predictions
ALTER TABLE public.studio_jobs
ADD COLUMN IF NOT EXISTS prediction_id TEXT;

-- Update status enum to include queued and running states
ALTER TABLE public.studio_jobs
DROP CONSTRAINT IF EXISTS studio_jobs_status_check;

ALTER TABLE public.studio_jobs
ADD CONSTRAINT studio_jobs_status_check
CHECK (status IN ('pending', 'queued', 'running', 'completed', 'failed'));

-- Add timing columns for job lifecycle tracking
ALTER TABLE public.studio_jobs
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS finished_at TIMESTAMPTZ;

-- Add outputs column for storing processed results
-- This replaces the concepts column with more structured data
ALTER TABLE public.studio_jobs
ADD COLUMN IF NOT EXISTS outputs JSONB;

-- Add index on prediction_id for webhook lookups
CREATE INDEX IF NOT EXISTS idx_studio_jobs_prediction_id
ON public.studio_jobs(prediction_id);

-- Add index on status for reconciler queries
CREATE INDEX IF NOT EXISTS idx_studio_jobs_status_created
ON public.studio_jobs(status, created_at);

-- Update the updated_at trigger to also set finished_at
CREATE OR REPLACE FUNCTION update_studio_jobs_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();

  IF NEW.status IN ('completed', 'failed') AND OLD.status NOT IN ('completed', 'failed') THEN
    NEW.finished_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
DROP TRIGGER IF EXISTS set_studio_jobs_timestamps ON public.studio_jobs;

CREATE TRIGGER set_studio_jobs_timestamps
  BEFORE UPDATE ON public.studio_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_studio_jobs_timestamps();

-- Comment for documentation
COMMENT ON COLUMN public.studio_jobs.prediction_id IS 'Replicate prediction ID for webhook correlation';
COMMENT ON COLUMN public.studio_jobs.started_at IS 'When the job moved from pending to queued';
COMMENT ON COLUMN public.studio_jobs.finished_at IS 'When the job reached completed or failed status';
COMMENT ON COLUMN public.studio_jobs.outputs IS 'Structured output data including processed concept URLs and metadata';
