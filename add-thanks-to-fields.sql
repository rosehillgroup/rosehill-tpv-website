-- Add 'thanks to' attribution fields to installations table
-- These fields will store attribution information separately from the main description

-- Add thanks_to_name field for the entity/person to thank
ALTER TABLE installations 
ADD COLUMN IF NOT EXISTS thanks_to_name TEXT;

-- Add thanks_to_url field for the optional website link
ALTER TABLE installations 
ADD COLUMN IF NOT EXISTS thanks_to_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN installations.thanks_to_name IS 'Name of entity/person to thank for the installation (e.g., GCC Sport Surfaces)';
COMMENT ON COLUMN installations.thanks_to_url IS 'Optional URL for the thanks to attribution link';

-- Update the installation_with_translations view to include the new fields
DROP VIEW IF EXISTS installation_with_translations;

CREATE VIEW installation_with_translations AS
SELECT 
    i.*,
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
    i18n.source as translation_source,
    i.thanks_to_name,
    i.thanks_to_url
FROM installations i
LEFT JOIN installation_i18n i18n ON i.id = i18n.installation_id;

COMMENT ON VIEW installation_with_translations IS 'View combining installations with translations, including thanks to attribution fields';

-- Optional: Update a sample installation to test the new fields
-- UPDATE installations 
-- SET thanks_to_name = 'GCC Sport Surfaces',
--     thanks_to_url = 'https://en.gccsportsurfaces.nl'
-- WHERE slug = 'basketball-court-installation-in-nijmegen'
-- LIMIT 1;