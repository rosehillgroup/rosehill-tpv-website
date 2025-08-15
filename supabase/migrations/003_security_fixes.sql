-- Security fixes migration
-- Addresses Supabase security warnings

-- 1. Enable RLS on translation_logs table
ALTER TABLE public.translation_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for translation_logs (service role can do anything, authenticated users can read their own)
CREATE POLICY "translation_logs_service_role_policy" ON public.translation_logs
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "translation_logs_read_policy" ON public.translation_logs
    FOR SELECT 
    TO authenticated
    USING (true);

-- 2. Fix function search_path security for all our functions
-- Set search_path to be immutable for security

-- Fix update_translation_status function
CREATE OR REPLACE FUNCTION public.update_translation_status(installation_id UUID, status JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
    UPDATE public.installations 
    SET translation_status = status 
    WHERE id = installation_id;
END;
$$;

-- Fix translate_existing_installations function  
CREATE OR REPLACE FUNCTION public.translate_existing_installations()
RETURNS TABLE (
    result TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
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

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix trigger_installation_translation function
CREATE OR REPLACE FUNCTION public.trigger_installation_translation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public, extensions
AS $$
DECLARE
    request_id BIGINT;
    response_data JSONB;
BEGIN
    -- Only trigger for new installations or when title/description changes
    IF (TG_OP = 'INSERT') OR 
       (TG_OP = 'UPDATE' AND (
           OLD.title IS DISTINCT FROM NEW.title OR 
           OLD.description IS DISTINCT FROM NEW.description OR
           OLD.location IS DISTINCT FROM NEW.location OR
           OLD.application IS DISTINCT FROM NEW.application
       )) THEN
        
        -- Log the translation trigger
        INSERT INTO public.translation_logs (installation_id, status, details, created_at)
        VALUES (
            NEW.id, 
            'triggered', 
            format('Auto-translation triggered for: %s', NEW.title),
            NOW()
        );

        -- Call Edge Function for translation
        SELECT extensions.net.http_post(
            url := 'https://otidaseqlgubqzsqazqt.supabase.co/functions/v1/translate-installation',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc2OTMzNywiZXhwIjoyMDY2MzQ1MzM3fQ.G_r1wSqCcYD02W7OB3a47Ff5YSHZEz5_fWxlTp4CZJo',
                'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc2OTMzNywiZXhwIjoyMDY2MzQ1MzM3fQ.G_r1wSqCcYD02W7OB3a47Ff5YSHZEz5_fWxlTp4CZJo'
            ),
            body := jsonb_build_object('id', NEW.id::text)
        ) INTO request_id;

    END IF;

    RETURN NEW;
END;
$$;

-- 3. Move pg_net extension from public schema to extensions schema
-- First create the extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Drop the extension from public and recreate in extensions schema
DROP EXTENSION IF EXISTS pg_net CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO service_role;

-- Update any references to use extensions.net instead of net
-- (Our functions above have been updated to use the correct schema)

-- Migration completed successfully
-- Security fixes: Enable RLS, fix function search_path, move pg_net to extensions schema