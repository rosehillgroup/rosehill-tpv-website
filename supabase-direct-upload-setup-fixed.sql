-- Supabase setup for direct upload architecture (FIXED VERSION)
-- Run this in your Supabase SQL Editor

-- 1. Create storage bucket for installer photos (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('tpv-photos', 'tpv-photos', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. Ensure photo_submissions table has the right structure for new architecture
-- Add any missing columns to existing table

DO $$
BEGIN
    -- Add install_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'photo_submissions' AND column_name = 'install_id'
    ) THEN
        ALTER TABLE public.photo_submissions ADD COLUMN install_id text;
    END IF;

    -- Ensure metadata column exists and is jsonb (should already exist)
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
            ALTER TABLE public.photo_submissions ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
        END IF;
    END IF;

    -- Add status column (mapped from approval_status) if using different name
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'photo_submissions' AND column_name = 'status'
    ) THEN
        -- Add status column as alias to approval_status for consistency
        ALTER TABLE public.photo_submissions ADD COLUMN status text;
        -- Copy existing approval_status values to status
        UPDATE public.photo_submissions SET status = approval_status WHERE status IS NULL;
        -- Set default
        ALTER TABLE public.photo_submissions ALTER COLUMN status SET DEFAULT 'pending';
    END IF;

    -- Add approval_date column if it doesn't exist (maps to approved_at)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'photo_submissions' AND column_name = 'approval_date'
    ) THEN
        ALTER TABLE public.photo_submissions ADD COLUMN approval_date timestamptz;
        -- Copy existing approved_at values
        UPDATE public.photo_submissions SET approval_date = approved_at WHERE approval_date IS NULL;
    END IF;

    -- Add approval_notes column if it doesn't exist (maps to moderation_notes)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'photo_submissions' AND column_name = 'approval_notes'
    ) THEN
        ALTER TABLE public.photo_submissions ADD COLUMN approval_notes text;
        -- Copy existing moderation_notes values
        UPDATE public.photo_submissions SET approval_notes = moderation_notes WHERE approval_notes IS NULL;
    END IF;
END $$;

-- 3. Storage policies for signed uploads
-- Drop existing storage policies first
DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to TPV folder" ON storage.objects;
DROP POLICY IF EXISTS "Service role full access" ON storage.objects;

-- Allow authenticated and anon users to upload to specific paths using signed URLs
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

-- Allow reading photos for admin interface (authenticated users only)
CREATE POLICY "Authenticated can view photos" ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'tpv-photos');

-- 4. RLS policies for photo_submissions table
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Anyone can submit photos" ON public.photo_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.photo_submissions;
DROP POLICY IF EXISTS "Admins can do everything" ON public.photo_submissions;
DROP POLICY IF EXISTS "Allow public photo submissions" ON public.photo_submissions;
DROP POLICY IF EXISTS "View own submissions" ON public.photo_submissions;
DROP POLICY IF EXISTS "Service role full access" ON public.photo_submissions;
DROP POLICY IF EXISTS "Service role can manage submissions" ON public.photo_submissions;
DROP POLICY IF EXISTS "Authenticated users can view submissions" ON public.photo_submissions;

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

    -- For now, return a placeholder URL
    -- In practice, you'd generate a signed URL here or call the storage API
    RETURN format('https://rgtaaqkbubzjrczrtdbu.supabase.co/storage/v1/object/public/%s/%s', bucket_name, file_path);
END;
$$;

-- 6. Create updated view for admin interface using correct column names
DROP VIEW IF EXISTS admin_photo_submissions;

CREATE OR REPLACE VIEW admin_photo_submissions AS
SELECT
    id,
    submission_timestamp as created_at, -- Map submission_timestamp to created_at
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
    COALESCE(status, approval_status) as status, -- Use status if exists, fallback to approval_status
    COALESCE(approval_date, approved_at) as approval_date, -- Use approval_date if exists, fallback to approved_at
    COALESCE(approval_notes, moderation_notes) as approval_notes, -- Use approval_notes if exists, fallback to moderation_notes
    metadata,
    -- Extract install_id from metadata if it exists there, otherwise use install_id column
    COALESCE(install_id, metadata->>'install_id') as install_id,
    -- Count of photos
    array_length(photo_urls, 1) as photo_count,
    -- Extract file information from metadata
    metadata->'files' as file_details
FROM public.photo_submissions
ORDER BY submission_timestamp DESC;

-- Grant access to the view
GRANT SELECT ON admin_photo_submissions TO authenticated;

-- 7. Create function to sync status fields (for consistency)
CREATE OR REPLACE FUNCTION sync_status_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Sync status and approval_status
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        NEW.approval_status = NEW.status;
    ELSIF NEW.approval_status IS DISTINCT FROM OLD.approval_status THEN
        NEW.status = NEW.approval_status;
    END IF;

    -- Sync approval_date and approved_at
    IF NEW.approval_date IS DISTINCT FROM OLD.approval_date THEN
        NEW.approved_at = NEW.approval_date;
    ELSIF NEW.approved_at IS DISTINCT FROM OLD.approved_at THEN
        NEW.approval_date = NEW.approved_at;
    END IF;

    -- Sync approval_notes and moderation_notes
    IF NEW.approval_notes IS DISTINCT FROM OLD.approval_notes THEN
        NEW.moderation_notes = NEW.approval_notes;
    ELSIF NEW.moderation_notes IS DISTINCT FROM OLD.moderation_notes THEN
        NEW.approval_notes = NEW.moderation_notes;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to keep fields in sync
DROP TRIGGER IF EXISTS sync_status_fields_trigger ON public.photo_submissions;
CREATE TRIGGER sync_status_fields_trigger
    BEFORE UPDATE ON public.photo_submissions
    FOR EACH ROW EXECUTE FUNCTION sync_status_fields();

-- 8. Verify setup
SELECT 'Setup completed successfully!' as message;

-- Check bucket exists
SELECT 'Bucket created: ' || id as status FROM storage.buckets WHERE id = 'tpv-photos';

-- Check storage policies
SELECT 'Storage policies: ' || count(*)::text as status FROM storage.policies WHERE bucket_id = 'tpv-photos';

-- Check table structure
SELECT 'Table columns: ' || string_agg(column_name, ', ' ORDER BY ordinal_position) as status
FROM information_schema.columns
WHERE table_name = 'photo_submissions' AND table_schema = 'public';