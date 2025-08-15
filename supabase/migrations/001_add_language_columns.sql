-- Add language-specific columns to installations table
-- This enables automatic translation storage for each installation

-- Add English columns (source language)
ALTER TABLE installations 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS location_en TEXT, 
ADD COLUMN IF NOT EXISTS description_en JSONB,
ADD COLUMN IF NOT EXISTS application_en TEXT;

-- Add French columns
ALTER TABLE installations
ADD COLUMN IF NOT EXISTS title_fr TEXT,
ADD COLUMN IF NOT EXISTS location_fr TEXT,
ADD COLUMN IF NOT EXISTS description_fr JSONB, 
ADD COLUMN IF NOT EXISTS application_fr TEXT;

-- Add German columns  
ALTER TABLE installations
ADD COLUMN IF NOT EXISTS title_de TEXT,
ADD COLUMN IF NOT EXISTS location_de TEXT,
ADD COLUMN IF NOT EXISTS description_de JSONB,
ADD COLUMN IF NOT EXISTS application_de TEXT;

-- Add Spanish columns
ALTER TABLE installations
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS location_es TEXT,
ADD COLUMN IF NOT EXISTS description_es JSONB,
ADD COLUMN IF NOT EXISTS application_es TEXT;

-- Populate English columns with existing data (backward compatibility)
UPDATE installations 
SET 
  title_en = title,
  location_en = location,
  description_en = description,
  application_en = application
WHERE title_en IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_installations_title_en ON installations(title_en);
CREATE INDEX IF NOT EXISTS idx_installations_title_fr ON installations(title_fr);
CREATE INDEX IF NOT EXISTS idx_installations_title_de ON installations(title_de);
CREATE INDEX IF NOT EXISTS idx_installations_title_es ON installations(title_es);

-- Add translation status tracking
ALTER TABLE installations 
ADD COLUMN IF NOT EXISTS translation_status JSONB DEFAULT '{"fr": false, "de": false, "es": false, "last_translated": null}';

-- Function to update translation status
CREATE OR REPLACE FUNCTION update_translation_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update translation status when language columns are populated
  NEW.translation_status = jsonb_build_object(
    'fr', NEW.title_fr IS NOT NULL AND NEW.description_fr IS NOT NULL,
    'de', NEW.title_de IS NOT NULL AND NEW.description_de IS NOT NULL, 
    'es', NEW.title_es IS NOT NULL AND NEW.description_es IS NOT NULL,
    'last_translated', CASE 
      WHEN NEW.title_fr IS NOT NULL OR NEW.title_de IS NOT NULL OR NEW.title_es IS NOT NULL 
      THEN NOW() 
      ELSE COALESCE((OLD.translation_status->>'last_translated')::timestamp, NULL)
    END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update translation status
DROP TRIGGER IF EXISTS update_translation_status_trigger ON installations;
CREATE TRIGGER update_translation_status_trigger
  BEFORE UPDATE ON installations
  FOR EACH ROW
  EXECUTE FUNCTION update_translation_status();

-- Comments for documentation
COMMENT ON COLUMN installations.title_en IS 'Installation title in English (source language)';
COMMENT ON COLUMN installations.title_fr IS 'Installation title in French (auto-translated)';
COMMENT ON COLUMN installations.title_de IS 'Installation title in German (auto-translated)';
COMMENT ON COLUMN installations.title_es IS 'Installation title in Spanish (auto-translated)';
COMMENT ON COLUMN installations.translation_status IS 'JSON object tracking translation completion status and timestamps';