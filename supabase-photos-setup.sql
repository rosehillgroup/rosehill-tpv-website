-- Supabase Setup for TPV Photo Uploads
-- Run this in your Supabase SQL editor

-- Create storage bucket for photo uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tpv-photos',
  'tpv-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Create table for photo submissions
CREATE TABLE IF NOT EXISTS public.photo_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  installer_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  location_city TEXT,
  location_country TEXT,
  installation_date DATE,
  project_name TEXT,
  project_description TEXT,
  tpv_products_used TEXT[],
  square_meters INTEGER,
  photo_urls TEXT[] NOT NULL,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'featured')),
  moderation_notes TEXT,
  terms_accepted BOOLEAN DEFAULT false NOT NULL,
  submission_ip TEXT,
  submission_timestamp TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  featured_at TIMESTAMPTZ,
  featured_by TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for common queries
CREATE INDEX idx_photo_submissions_approval_status ON public.photo_submissions(approval_status);
CREATE INDEX idx_photo_submissions_submission_timestamp ON public.photo_submissions(submission_timestamp DESC);
CREATE INDEX idx_photo_submissions_featured ON public.photo_submissions(approval_status) WHERE approval_status = 'featured';
CREATE INDEX idx_photo_submissions_email ON public.photo_submissions(email);

-- Create view for approved photos (public access)
CREATE OR REPLACE VIEW public.approved_photos AS
SELECT
  id,
  installer_name,
  company_name,
  location_city,
  location_country,
  installation_date,
  project_name,
  project_description,
  tpv_products_used,
  square_meters,
  photo_urls,
  submission_timestamp,
  featured_at IS NOT NULL AS is_featured,
  metadata
FROM public.photo_submissions
WHERE approval_status IN ('approved', 'featured')
ORDER BY
  CASE WHEN approval_status = 'featured' THEN 0 ELSE 1 END,
  submission_timestamp DESC;

-- Enable RLS (Row Level Security)
ALTER TABLE public.photo_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for public submissions (anyone can insert)
CREATE POLICY "Anyone can submit photos" ON public.photo_submissions
  FOR INSERT
  WITH CHECK (true);

-- Create policy for viewing own submissions
CREATE POLICY "Users can view their own submissions" ON public.photo_submissions
  FOR SELECT
  USING (email = current_setting('request.jwt.claim.email', true));

-- Create policy for admin access (you'll need to set up admin authentication)
CREATE POLICY "Admins can do everything" ON public.photo_submissions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create function to handle photo approval
CREATE OR REPLACE FUNCTION approve_photo_submission(
  submission_id UUID,
  approver_email TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.photo_submissions
  SET
    approval_status = 'approved',
    approved_at = NOW(),
    approved_by = approver_email
  WHERE id = submission_id AND approval_status = 'pending';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create function to feature a photo
CREATE OR REPLACE FUNCTION feature_photo_submission(
  submission_id UUID,
  featured_by_email TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.photo_submissions
  SET
    approval_status = 'featured',
    featured_at = NOW(),
    featured_by = featured_by_email,
    approved_at = COALESCE(approved_at, NOW()),
    approved_by = COALESCE(approved_by, featured_by_email)
  WHERE id = submission_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create function to reject a photo
CREATE OR REPLACE FUNCTION reject_photo_submission(
  submission_id UUID,
  rejection_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.photo_submissions
  SET
    approval_status = 'rejected',
    moderation_notes = rejection_notes
  WHERE id = submission_id AND approval_status = 'pending';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.approved_photos TO anon, authenticated;
GRANT INSERT ON public.photo_submissions TO anon, authenticated;
GRANT SELECT ON public.photo_submissions TO authenticated;

-- Storage policies
CREATE POLICY "Anyone can upload photos" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'tpv-photos');

CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'tpv-photos');

-- Create stats view for admin dashboard
CREATE OR REPLACE VIEW public.photo_submission_stats AS
SELECT
  COUNT(*) FILTER (WHERE approval_status = 'pending') AS pending_count,
  COUNT(*) FILTER (WHERE approval_status = 'approved') AS approved_count,
  COUNT(*) FILTER (WHERE approval_status = 'featured') AS featured_count,
  COUNT(*) FILTER (WHERE approval_status = 'rejected') AS rejected_count,
  COUNT(*) AS total_count,
  COUNT(DISTINCT email) AS unique_submitters,
  COUNT(*) FILTER (WHERE submission_timestamp >= NOW() - INTERVAL '7 days') AS submissions_last_week,
  COUNT(*) FILTER (WHERE submission_timestamp >= NOW() - INTERVAL '30 days') AS submissions_last_month
FROM public.photo_submissions;

GRANT SELECT ON public.photo_submission_stats TO authenticated;

-- Add comment explaining the setup
COMMENT ON TABLE public.photo_submissions IS 'Stores photo submissions from TPV installers via QR code campaign';
COMMENT ON VIEW public.approved_photos IS 'Public view of approved photo submissions for display on website';