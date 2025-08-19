-- Add 'thanks to' attribution fields to installations table
-- These fields will store attribution information separately from the main description

-- Check if columns exist before adding them
DO $$ 
BEGIN
    -- Add thanks_to_name field if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'thanks_to_name'
    ) THEN
        ALTER TABLE installations ADD COLUMN thanks_to_name TEXT;
        COMMENT ON COLUMN installations.thanks_to_name IS 'Name of entity/person to thank for the installation (e.g., GCC Sport Surfaces)';
    END IF;

    -- Add thanks_to_url field if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'thanks_to_url'
    ) THEN
        ALTER TABLE installations ADD COLUMN thanks_to_url TEXT;
        COMMENT ON COLUMN installations.thanks_to_url IS 'Optional URL for the thanks to attribution link';
    END IF;
END $$;

-- Update the installation_with_translations view to include the new fields
DROP VIEW IF EXISTS installation_with_translations;

CREATE VIEW installation_with_translations AS
SELECT 
    i.id,
    i.title,
    i.slug,
    i.location,
    i.installation_date,
    i.category,
    i.description,
    i.images,
    i.created_at,
    i.updated_at,
    i.thanks_to_name,
    i.thanks_to_url,
    i18n.lang,
    COALESCE(i18n.title, i.title) as display_title,
    COALESCE(i18n.overview, 
        CASE 
            WHEN jsonb_typeof(i.description) = 'string' THEN i.description #>> '{}'
            WHEN jsonb_typeof(i.description) = 'array' THEN array_to_string(ARRAY(SELECT jsonb_array_elements_text(i.description)), ' ')
            ELSE i.description::text 
        END
    ) as display_overview,
    COALESCE(i18n.location, i.location) as display_location,
    COALESCE(i18n.slug, i.slug) as display_slug,
    i18n.source as translation_source
FROM installations i
LEFT JOIN installation_i18n i18n ON i.id = i18n.installation_id;

COMMENT ON VIEW installation_with_translations IS 'View combining installations with translations, including thanks to attribution fields';

-- Optional: Update a sample installation to test the new fields
-- UPDATE installations 
-- SET thanks_to_name = 'GCC Sport Surfaces',
--     thanks_to_url = 'https://en.gccsportsurfaces.nl'
-- WHERE slug = 'basketball-court-installation-in-nijmegen'
-- LIMIT 1;