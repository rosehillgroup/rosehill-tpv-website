-- Force fix for search_path warnings - more aggressive approach
-- This will completely recreate the functions with different signatures if needed

-- First, let's see what functions exist and drop all variations
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Drop all variations of update_translation_status
    FOR func_record IN 
        SELECT proname, oidvectortypes(proargtypes) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'update_translation_status'
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS public.%I(%s) CASCADE', func_record.proname, func_record.args);
    END LOOP;

    -- Drop all variations of translate_existing_installations
    FOR func_record IN 
        SELECT proname, oidvectortypes(proargtypes) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'translate_existing_installations'
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS public.%I(%s) CASCADE', func_record.proname, func_record.args);
    END LOOP;
END
$$;

-- Now recreate with completely secure search_path
CREATE OR REPLACE FUNCTION public.update_translation_status(installation_id uuid, status jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path FROM CURRENT
AS $function$
BEGIN
    UPDATE public.installations 
    SET translation_status = status 
    WHERE id = installation_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.translate_existing_installations()
RETURNS TABLE(result text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path FROM CURRENT
AS $function$
DECLARE
    installation_record RECORD;
    request_id bigint;
BEGIN
    FOR installation_record IN 
        SELECT id, title, slug 
        FROM public.installations 
        ORDER BY installation_date DESC
        LIMIT 10
    LOOP
        -- Log the translation attempt
        INSERT INTO public.translation_logs (installation_id, status, details, created_at)
        VALUES (
            installation_record.id, 
            'triggered', 
            format('Triggered translation for: %s', installation_record.title),
            now()
        );

        -- Make HTTP request to Edge Function
        SELECT extensions.net.http_post(
            url := 'https://otidaseqlgubqzsqazqt.supabase.co/functions/v1/translate-installation',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc2OTMzNywiZXhwIjoyMDY2MzQ1MzM3fQ.G_r1wSqCcYD02W7OB3a47Ff5YSHZEz5_fWxlTp4CZJo',
                'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc2OTMzNywiZXhwIjoyMDY2MzQ1MzM3fQ.G_r1wSqCcYD02W7OB3a47Ff5YSHZEz5_fWxlTp4CZJo'
            ),
            body := jsonb_build_object('id', installation_record.id::text)
        ) INTO request_id;

        RETURN QUERY SELECT ('Triggered translation for ' || COALESCE(installation_record.title, 'Unknown') || ' installations')::text;
    END LOOP;

    IF NOT FOUND THEN
        RETURN QUERY SELECT 'No installations found to translate'::text;
    END IF;
END;
$function$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.update_translation_status(uuid, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.translate_existing_installations() TO service_role;

-- Verify the functions were created with proper search_path
SELECT 
    p.proname as function_name,
    p.prosrc as source_code,
    p.proconfig as config
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname IN ('update_translation_status', 'translate_existing_installations')
ORDER BY p.proname;