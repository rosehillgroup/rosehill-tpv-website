-- Combined Studio Migrations for Supabase (Safe Version)
-- Handles existing objects gracefully
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/okakomwfikxmwllvliva/sql

-- =============================================================================
-- MIGRATION 007: Create studio_jobs table (Safe)
-- =============================================================================

-- Create storage bucket (already safe with ON CONFLICT)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tpv-studio',
  'tpv-studio',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Create studio_jobs table (already safe with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.studio_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending',
  prompt TEXT NOT NULL,
  surface JSONB NOT NULL,
  palette_colors JSONB,
  style TEXT NOT NULL DEFAULT 'professional',
  count INTEGER NOT NULL DEFAULT 6,
  concepts JSONB,
  metadata JSONB,
  error TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);

-- Add indexes (already safe with IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_studio_jobs_status ON public.studio_jobs(status);
CREATE INDEX IF NOT EXISTS idx_studio_jobs_created_at ON public.studio_jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_studio_jobs_expires_at ON public.studio_jobs(expires_at);

-- Enable RLS
ALTER TABLE public.studio_jobs ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can create studio jobs" ON public.studio_jobs;
DROP POLICY IF EXISTS "Anyone can read studio jobs by ID" ON public.studio_jobs;
DROP POLICY IF EXISTS "Service role has full access to studio jobs" ON public.studio_jobs;

CREATE POLICY "Anyone can create studio jobs"
ON public.studio_jobs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can read studio jobs by ID"
ON public.studio_jobs
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Service role has full access to studio jobs"
ON public.studio_jobs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- =============================================================================
-- MIGRATION 008: Webhook pattern schema changes (Safe)
-- =============================================================================

-- Add columns (already safe with IF NOT EXISTS)
ALTER TABLE public.studio_jobs
ADD COLUMN IF NOT EXISTS prediction_id TEXT,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS finished_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS outputs JSONB;

-- Update status constraint
ALTER TABLE public.studio_jobs
DROP CONSTRAINT IF EXISTS studio_jobs_status_check;

ALTER TABLE public.studio_jobs
ADD CONSTRAINT studio_jobs_status_check
CHECK (status IN ('pending', 'queued', 'running', 'completed', 'failed'));

-- Add indexes (already safe with IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_studio_jobs_prediction_id
ON public.studio_jobs(prediction_id);

CREATE INDEX IF NOT EXISTS idx_studio_jobs_status_created
ON public.studio_jobs(status, created_at);

-- Update trigger function
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

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS set_studio_jobs_timestamps ON public.studio_jobs;
DROP TRIGGER IF EXISTS trigger_update_studio_job_updated_at ON public.studio_jobs;

CREATE TRIGGER set_studio_jobs_timestamps
  BEFORE UPDATE ON public.studio_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_studio_jobs_timestamps();

-- Verify the table structure
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'studio_jobs'
ORDER BY ordinal_position;
