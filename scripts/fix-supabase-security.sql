-- ============================================================================
-- Fix Supabase Security Linter Errors
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PART 1: Fix SECURITY DEFINER Views
-- Recreate views with security_invoker = true
-- ============================================================================

-- Fix: approved_photos view
DROP VIEW IF EXISTS public.approved_photos;
CREATE VIEW public.approved_photos
WITH (security_invoker = true)
AS
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

GRANT SELECT ON public.approved_photos TO anon, authenticated;

-- Fix: photo_submission_stats view
DROP VIEW IF EXISTS public.photo_submission_stats;
CREATE VIEW public.photo_submission_stats
WITH (security_invoker = true)
AS
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

-- Fix: admin_photo_submissions view
DROP VIEW IF EXISTS public.admin_photo_submissions;
CREATE VIEW public.admin_photo_submissions
WITH (security_invoker = true)
AS
SELECT
    id,
    submission_timestamp as created_at,
    installer_name,
    company_name,
    email,
    phone,
    location_city,
    location_country,
    installation_date,
    project_name,
    project_description,
    tpv_products_used,
    square_meters,
    photo_urls,
    approval_status as status,
    approved_at as approval_date,
    moderation_notes as approval_notes,
    metadata,
    COALESCE(metadata->>'install_id', '') as install_id,
    array_length(photo_urls, 1) as photo_count,
    metadata->'files' as file_details
FROM public.photo_submissions
ORDER BY submission_timestamp DESC;

GRANT SELECT ON public.admin_photo_submissions TO authenticated;

-- ============================================================================
-- PART 2: Enable RLS on Public Tables
-- These are read-only lookup tables, so we allow public SELECT
-- ============================================================================

-- Fix: cities table
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.cities;
CREATE POLICY "Allow public read access" ON public.cities
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Fix: countries table
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.countries;
CREATE POLICY "Allow public read access" ON public.countries
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Fix: sam_jobs table (unknown purpose, enabling read-only access)
ALTER TABLE public.sam_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.sam_jobs;
CREATE POLICY "Allow public read access" ON public.sam_jobs
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check views are no longer SECURITY DEFINER
SELECT
  schemaname,
  viewname,
  'security_invoker' as check_type
FROM pg_views
WHERE viewname IN ('approved_photos', 'photo_submission_stats', 'admin_photo_submissions');

-- Check RLS is enabled
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('cities', 'countries', 'sam_jobs')
AND schemaname = 'public';

SELECT 'Security fixes applied successfully!' as status;
