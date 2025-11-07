-- ============================================================================
-- Add Countries Table for Search
-- ============================================================================
-- This extends the city search to also search countries.
-- Users can search "Germany" or "France" and get country-level results.
-- ============================================================================

-- Create countries table
CREATE TABLE IF NOT EXISTS public.countries (
  id TEXT PRIMARY KEY,  -- ISO 3166-1 alpha-2 code (e.g., 'US', 'GB', 'DE')
  name TEXT NOT NULL,
  name_ascii TEXT NOT NULL,
  continent TEXT,
  capital TEXT,  -- Capital city name
  area_km2 NUMERIC,
  population BIGINT,
  geoname_id INTEGER,  -- GeoNames ID for API lookups
  lat DOUBLE PRECISION NOT NULL,  -- Center coordinates
  lon DOUBLE PRECISION NOT NULL,
  flag_emoji TEXT,
  alt_names TEXT[],  -- Alternate country names (Deutschland, Allemagne for Germany)
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable trigram extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Indexes for fast autocomplete
CREATE INDEX IF NOT EXISTS idx_countries_name_ascii_trgm
  ON countries USING GIN (name_ascii gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_countries_search_vector
  ON countries USING GIN (search_vector);

CREATE INDEX IF NOT EXISTS idx_countries_population
  ON countries (population DESC NULLS LAST);

-- Grant permissions
GRANT SELECT ON public.countries TO anon;
GRANT SELECT ON public.countries TO authenticated;

-- ============================================================================
-- NOTES
-- ============================================================================
-- • Data will be populated by import-countries.py script
-- • Country coordinates are typically the geographic center or capital
-- • alt_names includes native spellings and common translations
-- • search_vector enables full-text search across name + alt_names
-- ============================================================================
