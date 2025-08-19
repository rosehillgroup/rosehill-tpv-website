-- Database schema for installation translations
-- This creates the installation_i18n table to store translated content

-- Create the translation table
CREATE TABLE IF NOT EXISTS installation_i18n (
    id SERIAL PRIMARY KEY,
    installation_id UUID NOT NULL,
    lang VARCHAR(5) NOT NULL CHECK (lang IN ('fr', 'de', 'es', 'it', 'nl', 'pt')),
    slug TEXT,
    title TEXT,
    overview TEXT, 
    location TEXT,
    source VARCHAR(10) DEFAULT 'mt' CHECK (source IN ('mt', 'human')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one translation per installation per language
    UNIQUE(installation_id, lang),
    
    -- Foreign key to installations table
    FOREIGN KEY (installation_id) REFERENCES installations(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_installation_i18n_lookup ON installation_i18n(installation_id, lang);
CREATE INDEX IF NOT EXISTS idx_installation_i18n_lang ON installation_i18n(lang);
CREATE INDEX IF NOT EXISTS idx_installation_i18n_slug ON installation_i18n(slug);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_installation_i18n_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row changes
DROP TRIGGER IF EXISTS trigger_installation_i18n_updated_at ON installation_i18n;
CREATE TRIGGER trigger_installation_i18n_updated_at
    BEFORE UPDATE ON installation_i18n
    FOR EACH ROW
    EXECUTE FUNCTION update_installation_i18n_updated_at();

-- Add RLS (Row Level Security) policies if needed
-- Enable RLS on the table
ALTER TABLE installation_i18n ENABLE ROW LEVEL SECURITY;

-- Policy to allow reading all translations (public access)
CREATE POLICY "Allow public read access to installation translations" ON installation_i18n
    FOR SELECT USING (true);

-- Policy to allow service role to insert/update/delete translations
CREATE POLICY "Allow service role full access to installation translations" ON installation_i18n
    FOR ALL USING (auth.role() = 'service_role');

-- Add helpful comments
COMMENT ON TABLE installation_i18n IS 'Stores translated content for installations in different languages';
COMMENT ON COLUMN installation_i18n.installation_id IS 'Foreign key reference to installations table';
COMMENT ON COLUMN installation_i18n.lang IS 'Language code (fr, de, es, etc.)';
COMMENT ON COLUMN installation_i18n.slug IS 'URL-friendly slug in the target language';
COMMENT ON COLUMN installation_i18n.title IS 'Translated installation title';
COMMENT ON COLUMN installation_i18n.overview IS 'Translated project overview/description';
COMMENT ON COLUMN installation_i18n.location IS 'Translated or localized location name';
COMMENT ON COLUMN installation_i18n.source IS 'Translation source: mt (machine translation) or human (human edited)';

-- Create a view for easy querying with fallbacks
CREATE OR REPLACE VIEW installation_with_translations AS
SELECT 
    i.*,
    i18n.lang,
    COALESCE(i18n.title, i.title) as display_title,
    COALESCE(i18n.overview, i.description) as display_overview,
    COALESCE(i18n.location, i.location) as display_location,
    COALESCE(i18n.slug, i.slug) as display_slug,
    i18n.source as translation_source
FROM installations i
LEFT JOIN installation_i18n i18n ON i.id = i18n.installation_id;

COMMENT ON VIEW installation_with_translations IS 'View combining installations with translations, falling back to English when translation missing';