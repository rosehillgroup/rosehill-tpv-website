-- Fix remaining search_path warnings for functions
-- Target the specific functions that are still showing warnings

-- Drop and recreate update_translation_status with proper search_path
DROP FUNCTION IF EXISTS public.update_translation_status(UUID, JSONB);

CREATE FUNCTION public.update_translation_status(installation_id UUID, status JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.installations 
    SET translation_status = status 
    WHERE id = installation_id;
END;
$$;

-- Drop and recreate translate_existing_installations with proper search_path
DROP FUNCTION IF EXISTS public.translate_existing_installations();

CREATE FUNCTION public.translate_existing_installations()
RETURNS TABLE (result TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    installation_record RECORD;
    request_id BIGINT;
    response_data JSONB;
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
            NOW()
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

        RETURN QUERY SELECT 'Triggered translation for ' || COALESCE(installation_record.title, 'Unknown') || ' installations';
    END LOOP;

    IF NOT FOUND THEN
        RETURN QUERY SELECT 'No installations found to translate';
    END IF;
END;
$$;

-- Grant execute permissions to ensure functions work properly
GRANT EXECUTE ON FUNCTION public.update_translation_status(UUID, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.translate_existing_installations() TO service_role;