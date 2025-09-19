-- Supabase setup for direct upload architecture
-- Run this in your Supabase SQL Editor

-- 1. Create storage bucket for installer photos (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('tpv-photos', 'tpv-photos', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Update photo_submissions table to work with new architecture
-- The table should already exist from previous setup, but let's ensure it has the right structure

-- Check if we need to add any missing columns
DO $$
BEGIN
    -- Add install_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'photo_submissions' AND column_name = 'install_id'
    ) THEN
        ALTER TABLE public.photo_submissions ADD COLUMN install_id text;
    END IF;

    -- Ensure metadata column exists and is jsonb
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'photo_submissions' AND column_name = 'metadata' AND data_type = 'jsonb'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'photo_submissions' AND column_name = 'metadata'
        ) THEN
            -- Convert existing metadata column to jsonb
            ALTER TABLE public.photo_submissions ALTER COLUMN metadata TYPE jsonb USING metadata::jsonb;
        ELSE
            -- Add new metadata column
            ALTER TABLE public.photo_submissions ADD COLUMN metadata jsonb;
        END IF;
    END IF;
END $$;

-- 3. Storage policies for signed uploads
-- Allow authenticated and anon users to upload to specific paths
CREATE POLICY "Allow uploads to TPV folder" ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'tpv-photos' AND name LIKE 'TPV/%');

-- Allow service role to do everything
CREATE POLICY "Service role full access" ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'tpv-photos')
WITH CHECK (bucket_id = 'tpv-photos');

-- 4. RLS policies for photo_submissions table
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Anyone can submit photos" ON public.photo_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.photo_submissions;
DROP POLICY IF EXISTS "Admins can do everything" ON public.photo_submissions;
DROP POLICY IF EXISTS "Allow public photo submissions" ON public.photo_submissions;
DROP POLICY IF EXISTS "View own submissions" ON public.photo_submissions;
DROP POLICY IF EXISTS "Service role full access" ON public.photo_submissions;

-- Create new policies for the direct upload architecture
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

-- 5. Create helper function to get signed download URLs for admin interface
CREATE OR REPLACE FUNCTION get_photo_download_url(bucket_name text, file_path text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    download_url text;
BEGIN
    -- This function will be called from the admin interface
    -- to get temporary download URLs for viewing photos

    -- For now, return a placeholder
    -- In practice, you'd generate a signed URL here or call the storage API
    RETURN format('https://rgtaaqkbubzjrczrtdbu.supabase.co/storage/v1/object/public/%s/%s', bucket_name, file_path);
END;
$$;

-- 6. Create view for admin interface
CREATE OR REPLACE VIEW admin_photo_submissions AS
SELECT
    id,
    created_at,
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
    status,
    approval_date,
    approval_notes,
    metadata,
    -- Extract install_id from metadata if it exists there, otherwise use install_id column
    COALESCE(install_id, metadata->>'install_id') as install_id,
    -- Count of photos
    array_length(photo_urls, 1) as photo_count,
    -- Extract file information from metadata
    metadata->'files' as file_details
FROM public.photo_submissions
ORDER BY created_at DESC;

-- Grant access to the view
GRANT SELECT ON admin_photo_submissions TO authenticated;

-- 7. Verify setup
SELECT 'Setup completed successfully!' as message;

-- Check bucket exists
SELECT 'Bucket created: ' || id as status FROM storage.buckets WHERE id = 'tpv-photos';

-- Check policies
SELECT 'Storage policies: ' || count(*)::text as status FROM storage.policies WHERE bucket_id = 'tpv-photos';

-- Check table structure
SELECT 'Table columns: ' || string_agg(column_name, ', ') as status
FROM information_schema.columns
WHERE table_name = 'photo_submissions' AND table_schema = 'public';