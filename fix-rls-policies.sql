-- Fix Row Level Security policies for installation_i18n table
-- This allows the anonymous role to insert/update translations

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to installation translations" ON installation_i18n;
DROP POLICY IF EXISTS "Allow service role full access to installation translations" ON installation_i18n;

-- Create new policies that allow both read and write for anonymous users
-- This is needed because the Edge Function uses the anonymous key

-- Policy 1: Allow everyone to read translations
CREATE POLICY "Allow public read access to installation translations" 
ON installation_i18n 
FOR SELECT 
USING (true);

-- Policy 2: Allow anonymous users to insert translations
CREATE POLICY "Allow anonymous insert to installation translations" 
ON installation_i18n 
FOR INSERT 
WITH CHECK (true);

-- Policy 3: Allow anonymous users to update translations
CREATE POLICY "Allow anonymous update to installation translations" 
ON installation_i18n 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Policy 4: Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access to installation translations" 
ON installation_i18n 
FOR ALL 
USING (auth.role() = 'service_role');

-- Verify the policies are created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'installation_i18n'
ORDER BY policyname;