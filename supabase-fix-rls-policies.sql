-- Fix Row Level Security policies for photo submissions
-- Run this in Supabase SQL Editor to resolve RLS policy conflicts

-- Drop existing policies that may be conflicting
DROP POLICY IF EXISTS "Anyone can submit photos" ON public.photo_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.photo_submissions;
DROP POLICY IF EXISTS "Admins can do everything" ON public.photo_submissions;

-- Create new, simplified policies that explicitly allow anon access

-- Allow anonymous and authenticated users to insert photo submissions
CREATE POLICY "Allow public photo submissions" ON public.photo_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to view their own submissions
CREATE POLICY "View own submissions" ON public.photo_submissions
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Allow service role (admin) full access to all records
CREATE POLICY "Service role full access" ON public.photo_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verify policies are working
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'photo_submissions';

-- Test insert permissions
COMMENT ON TABLE public.photo_submissions IS 'RLS policies updated to allow public photo submissions';