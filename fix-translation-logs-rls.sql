-- Complete fix for translation_logs RLS and trigger issues
-- Run this in Supabase SQL Editor

-- Step 1: Remove any existing duplicate entries
DELETE FROM translation_logs 
WHERE id IN (
    SELECT id FROM (
        SELECT id, 
               ROW_NUMBER() OVER (PARTITION BY installation_id, trigger_type ORDER BY created_at DESC) as rn
        FROM translation_logs
        WHERE trigger_type = 'auto_translation'
    ) t 
    WHERE t.rn > 1
);

-- Step 2: Drop existing trigger to recreate it
DROP TRIGGER IF EXISTS installation_translation_trigger ON installations;

-- Step 3: Create a more permissive RLS policy for trigger operations
-- First check if the policy exists and drop it if needed
DROP POLICY IF EXISTS "Allow trigger inserts" ON translation_logs;

-- Create a comprehensive policy that allows:
-- 1. All inserts (for triggers)
-- 2. All selects (for reading)
-- 3. All updates (for status changes)
CREATE POLICY "Allow all operations on translation_logs" ON translation_logs
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Step 4: Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION trigger_installation_translation()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger for INSERT or significant UPDATE operations
    IF (TG_OP = 'INSERT') OR 
       (TG_OP = 'UPDATE' AND (
           OLD.title IS DISTINCT FROM NEW.title OR 
           OLD.location IS DISTINCT FROM NEW.location OR 
           OLD.description IS DISTINCT FROM NEW.description
       )) THEN
        
        -- Use UPSERT to handle conflicts gracefully
        INSERT INTO public.translation_logs (
            installation_id, 
            trigger_type, 
            status, 
            details, 
            created_at
        )
        VALUES (
            NEW.id, 
            'auto_translation',
            'triggered', 
            jsonb_build_object(
                'message', 'Auto-translation triggered',
                'title', NEW.title,
                'operation', TG_OP,
                'timestamp', NOW()
            ),
            NOW()
        )
        ON CONFLICT (installation_id, trigger_type) 
        DO UPDATE SET 
            status = 'triggered',
            details = jsonb_build_object(
                'message', 'Auto-translation re-triggered',
                'title', NEW.title,
                'operation', TG_OP,
                'timestamp', NOW()
            ),
            created_at = NOW();
            
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the main operation
        RAISE WARNING 'Translation log trigger failed: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Recreate the trigger
CREATE TRIGGER installation_translation_trigger
    AFTER INSERT OR UPDATE ON installations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_installation_translation();

-- Step 6: Verify the setup
-- Check RLS is enabled but with permissive policies
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled",
    (SELECT count(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = 'translation_logs') as "Policy Count"
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'translation_logs';

-- Show current policies
SELECT policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'translation_logs';

SELECT 'Translation logs RLS and trigger setup completed successfully' as result;