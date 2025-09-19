-- Supabase setup for direct upload architecture (SIMPLE VERSION)
-- Run this in your Supabase SQL Editor

-- 1. Create storage bucket for installer photos (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('tpv-photos', 'tpv-photos', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. Add missing columns to existing photo_submissions table
DO $$
BEGIN
    -- Add install_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'photo_submissions' AND column_name = 'install_id'
    ) THEN
        ALTER TABLE public.photo_submissions ADD COLUMN install_id text;
    END IF;

    -- Add status column if it doesn't exist (maps to approval_status)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'photo_submissions' AND column_name = 'status'
    ) THEN
        ALTER TABLE public.photo_submissions ADD COLUMN status text DEFAULT 'pending';
        -- Copy existing approval_status values to status
        UPDATE public.photo_submissions SET status = approval_status WHERE approval_status IS NOT NULL;
    END IF;

    -- Add approval_date column if it doesn't exist (maps to approved_at)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'photo_submissions' AND column_name = 'approval_date'
    ) THEN
        ALTER TABLE public.photo_submissions ADD COLUMN approval_date timestamptz;
        -- Copy existing approved_at values
        UPDATE public.photo_submissions SET approval_date = approved_at WHERE approved_at IS NOT NULL;
    END IF;

    -- Add approval_notes column if it doesn't exist (maps to moderation_notes)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'photo_submissions' AND column_name = 'approval_notes'
    ) THEN
        ALTER TABLE public.photo_submissions ADD COLUMN approval_notes text;
        -- Copy existing moderation_notes values
        UPDATE public.photo_submissions SET approval_notes = moderation_notes WHERE moderation_notes IS NOT NULL;
    END IF;
END $$;

-- 3. Drop existing conflicting policies
DROP POLICY IF EXISTS "Anyone can submit photos" ON public.photo_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.photo_submissions;
DROP POLICY IF EXISTS "Admins can do everything" ON public.photo_submissions;
DROP POLICY IF EXISTS "Allow public photo submissions" ON public.photo_submissions;
DROP POLICY IF EXISTS "View own submissions" ON public.photo_submissions;
DROP POLICY IF EXISTS "Service role full access" ON public.photo_submissions;
DROP POLICY IF EXISTS "Service role can manage submissions" ON public.photo_submissions;
DROP POLICY IF EXISTS "Authenticated users can view submissions" ON public.photo_submissions;

-- 4. Create new RLS policies for photo_submissions
-- Only service role (our functions) can insert/update records
CREATE POLICY "Service role can manage submissions" ON public.photo_submissions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Authenticated users (admins) can view all submissions
CREATE POLICY "Authenticated users can view submissions" ON public.photo_submissions
FOR SELECT
TO authenticated
USING (true);

-- 5. Storage policies - drop existing ones first
DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to TPV folder" ON storage.objects;
DROP POLICY IF EXISTS "Service role full access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can view photos" ON storage.objects;

-- Allow uploads to TPV folder using signed URLs
CREATE POLICY "Allow uploads to TPV folder" ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'tpv-photos' AND name LIKE 'TPV/%');

-- Allow service role full access
CREATE POLICY "Service role full access" ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'tpv-photos')
WITH CHECK (bucket_id = 'tpv-photos');

-- Allow authenticated users to view photos for admin interface
CREATE POLICY "Authenticated can view photos" ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'tpv-photos');

-- 6. Create admin view using correct column names
DROP VIEW IF EXISTS admin_photo_submissions;

CREATE OR REPLACE VIEW admin_photo_submissions AS
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
    COALESCE(status, approval_status) as status,
    COALESCE(approval_date, approved_at) as approval_date,
    COALESCE(approval_notes, moderation_notes) as approval_notes,
    metadata,
    COALESCE(install_id, metadata->>'install_id') as install_id,
    array_length(photo_urls, 1) as photo_count,
    metadata->'files' as file_details
FROM public.photo_submissions
ORDER BY submission_timestamp DESC;

-- Grant access to the view
GRANT SELECT ON admin_photo_submissions TO authenticated;

-- 7. Success message
SELECT 'Direct upload setup completed successfully!' as message;