-- Fix for duplicate translation logs issue
-- Run this in Supabase SQL Editor

-- First, remove any existing duplicate entries
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

-- Drop the existing trigger to recreate it with proper duplicate handling
DROP TRIGGER IF EXISTS installation_translation_trigger ON installations;

-- Recreate the trigger function with ON CONFLICT handling
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
        
        -- Insert with ON CONFLICT to avoid duplicate key errors
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
            status = EXCLUDED.status,
            details = EXCLUDED.details,
            created_at = EXCLUDED.created_at;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER installation_translation_trigger
    AFTER INSERT OR UPDATE ON installations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_installation_translation();

-- Verify the fix worked
SELECT 'Translation logs trigger updated successfully' as result;