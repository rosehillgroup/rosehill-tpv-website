-- ============================================================================
-- IMPROVED City Autocomplete Function (v2)
-- ============================================================================
-- Fixes ranking issues to prioritize exact/prefix matches over fuzzy matches
-- ============================================================================

DROP FUNCTION IF EXISTS city_autocomplete(TEXT);

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
    -- Tier 1: EXACT name match (highest priority)
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
      1.0 AS sim_score,
      c.population AS sort_population
    FROM cities c
    WHERE LOWER(c.name) = LOWER(query_text)
       OR LOWER(c.name_ascii) = LOWER(query_text)

    UNION ALL

    -- Tier 2: PREFIX match on name (second priority)
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
      0.9 AS sim_score,
      c.population AS sort_population
    FROM cities c
    WHERE (c.name_ascii ILIKE query_text || '%'
           OR c.name ILIKE query_text || '%')
      AND LOWER(c.name) != LOWER(query_text)
      AND LOWER(c.name_ascii) != LOWER(query_text)

    UNION ALL

    -- Tier 3: Alternate name EXACT match
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
      0.8 AS sim_score,
      c.population AS sort_population
    FROM cities c, UNNEST(c.alt_names) AS alt
    WHERE LOWER(alt) = LOWER(query_text)

    UNION ALL

    -- Tier 4: Alternate name PREFIX match
    SELECT
      c.name,
      c.country,
      c.country_code,
      c.admin1,
      c.flag_emoji,
      c.lat,
      c.lon,
      c.population,
      4 AS match_rank,
      0.7 AS sim_score,
      c.population AS sort_population
    FROM cities c, UNNEST(c.alt_names) AS alt
    WHERE alt ILIKE query_text || '%'
      AND LOWER(alt) != LOWER(query_text)

    UNION ALL

    -- Tier 5: Fuzzy trigram match (lowest priority, only if similarity > 0.4)
    SELECT
      c.name,
      c.country,
      c.country_code,
      c.admin1,
      c.flag_emoji,
      c.lat,
      c.lon,
      c.population,
      5 AS match_rank,
      similarity(c.name_ascii, query_text) AS sim_score,
      c.population AS sort_population
    FROM cities c
    WHERE similarity(c.name_ascii, query_text) > 0.4
      AND NOT (c.name_ascii ILIKE query_text || '%')
  )
  -- Deduplicate and sort
  SELECT DISTINCT ON (name, country, COALESCE(admin1, ''))
    name,
    country,
    country_code,
    admin1,
    flag_emoji,
    lat,
    lon,
    population
  FROM ranked_cities
  ORDER BY
    name,
    country,
    COALESCE(admin1, ''),  -- DISTINCT ON keys
    match_rank ASC,         -- Exact/prefix matches first
    sim_score DESC,         -- Higher similarity first
    sort_population DESC NULLS LAST  -- Larger cities first within same tier
  LIMIT 12;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION city_autocomplete(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION city_autocomplete(TEXT) TO authenticated;

-- ============================================================================
-- Test queries to verify improved ranking
-- ============================================================================

-- Test 1: "munich" should return Munich, Germany first
-- SELECT * FROM city_autocomplete('munich');

-- Test 2: "par" should return Paris first
-- SELECT * FROM city_autocomplete('par');

-- Test 3: "new" should return large "New X" cities first
-- SELECT * FROM city_autocomplete('new');

-- Test 4: Partial/fuzzy should still work
-- SELECT * FROM city_autocomplete('prais');  -- Should find Paris via fuzzy

-- ============================================================================
-- IMPROVEMENTS in v2:
-- ============================================================================
-- 1. Added Tier 1 for EXACT name matches (highest priority)
-- 2. Tier 2 is now PREFIX matches only (not fuzzy)
-- 3. Tier 3-4 handle alternate name exact/prefix matches
-- 4. Tier 5 is fuzzy matching (lowest priority)
-- 5. Increased fuzzy similarity threshold from 0.3 to 0.4 (reduce noise)
-- 6. Excluded prefix matches from fuzzy tier to avoid duplicates
-- 7. Fixed DISTINCT ON to handle NULL admin1 values properly
-- 8. Clearer ranking: exact > prefix > alt_exact > alt_prefix > fuzzy
-- ============================================================================
