-- Create tpv-visualiser storage bucket for TPV Design Visualiser
-- Stores user-uploaded reference photos and generated textures
-- Private bucket with signed URLs for secure access

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tpv-visualiser',
  'tpv-visualiser',
  false, -- Private bucket, accessed via signed URLs
  12582912, -- 12MB file size limit (12 * 1024 * 1024 bytes)
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Note: RLS is already enabled on storage.objects by default in Supabase
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated Rosehill users to upload files
-- Users with @rosehill.group email can INSERT
CREATE POLICY "Rosehill users can upload to tpv-visualiser"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tpv-visualiser'
  AND auth.jwt() ->> 'email' LIKE '%@rosehill.group'
);

-- Policy: Allow authenticated Rosehill users to read their own files
-- Users can SELECT files they uploaded
CREATE POLICY "Rosehill users can read tpv-visualiser files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'tpv-visualiser'
  AND auth.jwt() ->> 'email' LIKE '%@rosehill.group'
);

-- Policy: Allow authenticated Rosehill users to update their own files
-- Users can UPDATE files they uploaded
CREATE POLICY "Rosehill users can update tpv-visualiser files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'tpv-visualiser'
  AND auth.jwt() ->> 'email' LIKE '%@rosehill.group'
)
WITH CHECK (
  bucket_id = 'tpv-visualiser'
  AND auth.jwt() ->> 'email' LIKE '%@rosehill.group'
);

-- Policy: Allow authenticated Rosehill users to delete their own files
-- Users can DELETE files they uploaded
CREATE POLICY "Rosehill users can delete tpv-visualiser files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'tpv-visualiser'
  AND auth.jwt() ->> 'email' LIKE '%@rosehill.group'
);

-- Policy: Service role bypass for cleanup functions
-- Allow service role to manage all files (for automated cleanup)
CREATE POLICY "Service role has full access to tpv-visualiser"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'tpv-visualiser')
WITH CHECK (bucket_id = 'tpv-visualiser');

-- Create cleanup function to delete files older than 24 hours
-- This prevents storage bloat from abandoned uploads
CREATE OR REPLACE FUNCTION cleanup_old_visualiser_files()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = 'tpv-visualiser'
    AND created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Schedule cleanup to run daily
-- Note: This requires pg_cron extension, which may need to be enabled
-- Run: CREATE EXTENSION IF NOT EXISTS pg_cron;
-- Then uncomment the following line:
-- SELECT cron.schedule('cleanup-visualiser-files', '0 2 * * *', 'SELECT cleanup_old_visualiser_files()');

-- Manual cleanup can be run with:
-- SELECT cleanup_old_visualiser_files();

COMMENT ON FUNCTION cleanup_old_visualiser_files() IS 'Deletes tpv-visualiser files older than 24 hours to prevent storage bloat';
