-- ============================================================================
-- Global City Search - Supabase Database Schema
-- ============================================================================
-- Run this script in Supabase SQL Editor to set up the cities table,
-- indexes, and autocomplete function for ~150k cities with fuzzy search.
-- ============================================================================

-- Create the cities table
CREATE TABLE IF NOT EXISTS public.cities (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ascii TEXT NOT NULL,
  country_code TEXT NOT NULL,
  country TEXT NOT NULL,
  admin1_code TEXT,
  admin1 TEXT,  -- State/province name
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  population INTEGER,
  alt_names TEXT[],  -- Array of alternate spellings (München, Munich, etc.)
  search_vector TSVECTOR,  -- Full-text search vector
  flag_emoji TEXT,  -- Country flag emoji for display
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable the trigram extension for fuzzy string matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- INDEXES for fast autocomplete queries
-- ============================================================================

-- Trigram index for fuzzy ASCII name matching (handles typos)
CREATE INDEX IF NOT EXISTS idx_cities_name_ascii_trgm
  ON cities USING GIN (name_ascii gin_trgm_ops);

-- Full-text search index for alternate names
CREATE INDEX IF NOT EXISTS idx_cities_search_vector
  ON cities USING GIN (search_vector);

-- Composite index for country/admin filtering
CREATE INDEX IF NOT EXISTS idx_cities_country_admin
  ON cities (country_code, admin1_code);

-- Population index for ranking results (larger cities first)
CREATE INDEX IF NOT EXISTS idx_cities_population
  ON cities (population DESC NULLS LAST);

-- ============================================================================
-- AUTOCOMPLETE FUNCTION
-- ============================================================================
-- Returns up to 12 matching cities with 3-tier matching strategy:
--   1. Exact prefix match on ASCII name (e.g., "par" matches "Paris")
--   2. Alternate name prefix match (e.g., "munich" matches München)
--   3. Fuzzy trigram match for typos (e.g., "prais" matches Paris)
-- ============================================================================

CREATE OR REPLACE FUNCTION city_autocomplete(query_text TEXT)
RETURNS TABLE(
  name TEXT,
  country TEXT,
  country_code TEXT,
  admin1 TEXT,
  flag_emoji TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  population INTEGER
)
LANGUAGE SQL
STABLE
PARALLEL SAFE
AS $$
  WITH ranked_cities AS (
    -- Tier 1: Exact prefix match on ASCII name (highest priority)
    SELECT
      c.name,
      c.country,
      c.country_code,
      c.admin1,
      c.flag_emoji,
      c.lat,
      c.lon,
      c.population,
      1 AS match_rank,
      similarity(lower(c.name_ascii), lower(query_text)) AS sim_score
    FROM cities c
    WHERE c.name_ascii ILIKE query_text || '%'

    UNION ALL

    -- Tier 2: Alternate name prefix matches (for international names)
    SELECT
      c.name,
      c.country,
      c.country_code,
      c.admin1,
      c.flag_emoji,
      c.lat,
      c.lon,
      c.population,
      2 AS match_rank,
      similarity(lower(alt), lower(query_text)) AS sim_score
    FROM cities c, UNNEST(c.alt_names) AS alt
    WHERE alt ILIKE query_text || '%'

    UNION ALL

    -- Tier 3: Fuzzy trigram match (handles typos, similarity > 0.3)
    SELECT
      c.name,
      c.country,
      c.country_code,
      c.admin1,
      c.flag_emoji,
      c.lat,
      c.lon,
      c.population,
      3 AS match_rank,
      similarity(c.name_ascii, query_text) AS sim_score
    FROM cities c
    WHERE similarity(c.name_ascii, query_text) > 0.3
  )
  -- Deduplicate by (name, country, admin1) and rank by:
  --   1. Match tier (prefix > alternate > fuzzy)
  --   2. Similarity score
  --   3. Population (larger cities first)
  SELECT DISTINCT ON (name, country, admin1)
    name, country, country_code, admin1, flag_emoji, lat, lon, population
  FROM ranked_cities
  ORDER BY
    name, country, admin1,  -- GROUP BY keys for DISTINCT ON
    match_rank ASC,         -- Tier 1 results first
    sim_score DESC,         -- Higher similarity first
    population DESC NULLS LAST  -- Larger cities first
  LIMIT 12;
$$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
-- Allow anonymous users to read cities and call autocomplete function
-- (Supabase anon key will use this)
-- ============================================================================

GRANT SELECT ON public.cities TO anon;
GRANT EXECUTE ON FUNCTION city_autocomplete(TEXT) TO anon;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these after importing data to verify everything works:
-- ============================================================================

-- Test 1: Check table has data
-- SELECT COUNT(*) as total_cities FROM cities;

-- Test 2: Check indexes are created
-- SELECT indexname FROM pg_indexes WHERE tablename = 'cities';

-- Test 3: Test autocomplete for "paris"
-- SELECT * FROM city_autocomplete('paris');

-- Test 4: Test fuzzy search (typo)
-- SELECT * FROM city_autocomplete('prais');

-- Test 5: Test international alternate names
-- SELECT * FROM city_autocomplete('munich');  -- should find München
-- SELECT * FROM city_autocomplete('münchen'); -- should also work

-- ============================================================================
-- NOTES
-- ============================================================================
-- • This schema supports ~150k-500k cities comfortably
-- • Expected query time: 20-100ms depending on query complexity
-- • Trigram index size: ~50-100MB for 150k cities
-- • Run ANALYZE cities; after importing data to update statistics
-- • GeoNames data requires attribution: https://www.geonames.org/
-- ============================================================================
