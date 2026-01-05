-- ============================================================================
-- Fix Supabase Security Warnings
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PART 1: Fix Function Search Path Mutable Warnings
-- Add SET search_path = '' to make functions immune to search_path attacks
-- ============================================================================

-- Fix: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix: update_user_roles_updated_at
CREATE OR REPLACE FUNCTION public.update_user_roles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix: is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    );
END;
$$;

-- Fix: get_user_role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM public.user_roles
    WHERE user_id = auth.uid();

    RETURN COALESCE(user_role, 'user');
END;
$$;

-- Fix: update_project_design_count
CREATE OR REPLACE FUNCTION public.update_project_design_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.projects
        SET design_count = design_count + 1
        WHERE id = NEW.project_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.projects
        SET design_count = GREATEST(0, design_count - 1)
        WHERE id = OLD.project_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.project_id IS DISTINCT FROM NEW.project_id THEN
        IF OLD.project_id IS NOT NULL THEN
            UPDATE public.projects
            SET design_count = GREATEST(0, design_count - 1)
            WHERE id = OLD.project_id;
        END IF;
        IF NEW.project_id IS NOT NULL THEN
            UPDATE public.projects
            SET design_count = design_count + 1
            WHERE id = NEW.project_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- Fix: cleanup_old_visualiser_files
CREATE OR REPLACE FUNCTION public.cleanup_old_visualiser_files()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM storage.objects
        WHERE bucket_id = 'tpv-studio'
        AND created_at < NOW() - INTERVAL '24 hours'
        AND name LIKE 'visualiser/%'
        RETURNING *
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;

    RETURN deleted_count;
END;
$$;

-- Fix: location_autocomplete
CREATE OR REPLACE FUNCTION public.location_autocomplete(query_text TEXT)
RETURNS TABLE(
    name TEXT,
    country TEXT,
    country_code TEXT,
    admin1 TEXT,
    flag_emoji TEXT,
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    population INTEGER,
    result_type TEXT
)
LANGUAGE sql
STABLE
PARALLEL SAFE
SET search_path = ''
AS $$
    -- Country matches (highest priority for exact/prefix matches)
    SELECT
        c.name,
        c.name as country,
        c.id as country_code,
        NULL::TEXT as admin1,
        c.flag_emoji,
        c.lat,
        c.lon,
        c.population::INTEGER,
        'country'::TEXT as result_type
    FROM public.countries c
    WHERE c.name_ascii ILIKE query_text || '%'
       OR EXISTS (SELECT 1 FROM unnest(c.alt_names) alt WHERE alt ILIKE query_text || '%')

    UNION ALL

    -- City matches
    SELECT
        ct.name,
        ct.country,
        ct.country_code,
        ct.admin1,
        ct.flag_emoji,
        ct.lat,
        ct.lon,
        ct.population,
        'city'::TEXT as result_type
    FROM public.cities ct
    WHERE ct.name_ascii ILIKE query_text || '%'
       OR EXISTS (SELECT 1 FROM unnest(ct.alt_names) alt WHERE alt ILIKE query_text || '%')
       OR similarity(ct.name_ascii, query_text) > 0.3

    ORDER BY
        CASE WHEN result_type = 'country' THEN 0 ELSE 1 END,
        population DESC NULLS LAST
    LIMIT 12;
$$;

-- Fix: update_studio_job_updated_at
CREATE OR REPLACE FUNCTION public.update_studio_job_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix: cleanup_old_studio_jobs
CREATE OR REPLACE FUNCTION public.cleanup_old_studio_jobs()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM public.studio_jobs
        WHERE expires_at < NOW()
        AND status IN ('completed', 'failed')
        RETURNING *
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;

    RETURN deleted_count;
END;
$$;

-- Fix: update_studio_jobs_timestamps
CREATE OR REPLACE FUNCTION public.update_studio_jobs_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$;

-- Fix: approve_photo_submission
CREATE OR REPLACE FUNCTION public.approve_photo_submission(
    submission_id UUID,
    approver_email TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    UPDATE public.photo_submissions
    SET
        approval_status = 'approved',
        approved_at = NOW(),
        approved_by = approver_email
    WHERE id = submission_id AND approval_status = 'pending';

    RETURN FOUND;
END;
$$;

-- Fix: feature_photo_submission
CREATE OR REPLACE FUNCTION public.feature_photo_submission(
    submission_id UUID,
    featured_by_email TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    UPDATE public.photo_submissions
    SET
        approval_status = 'featured',
        featured_at = NOW(),
        featured_by = featured_by_email,
        approved_at = COALESCE(approved_at, NOW()),
        approved_by = COALESCE(approved_by, featured_by_email)
    WHERE id = submission_id;

    RETURN FOUND;
END;
$$;

-- Fix: reject_photo_submission
CREATE OR REPLACE FUNCTION public.reject_photo_submission(
    submission_id UUID,
    rejection_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    UPDATE public.photo_submissions
    SET
        approval_status = 'rejected',
        moderation_notes = rejection_notes
    WHERE id = submission_id AND approval_status = 'pending';

    RETURN FOUND;
END;
$$;

-- ============================================================================
-- PART 2: Move pg_trgm extension to extensions schema
-- ============================================================================

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Drop and recreate pg_trgm in extensions schema
DROP EXTENSION IF EXISTS pg_trgm;
CREATE EXTENSION pg_trgm SCHEMA extensions;

-- Grant usage on the extensions schema
GRANT USAGE ON SCHEMA extensions TO anon, authenticated;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'Function and extension warnings fixed!' as status;
SELECT 'Remember to enable Leaked Password Protection in Supabase Dashboard!' as reminder;
