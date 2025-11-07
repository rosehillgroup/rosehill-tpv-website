-- ============================================================================
-- Combined City + Country Autocomplete Function
-- ============================================================================
-- Searches both cities and countries, returning unified results with a
-- result_type field to distinguish between them.
--
-- Usage:
--   SELECT * FROM location_autocomplete('germany');  -- Returns country
--   SELECT * FROM location_autocomplete('berlin');   -- Returns city
--   SELECT * FROM location_autocomplete('par');      -- Returns Paris + Paraguay
-- ============================================================================

-- Drop old function if exists
DROP FUNCTION IF EXISTS city_autocomplete(TEXT);
DROP FUNCTION IF EXISTS location_autocomplete(TEXT);

-- Create combined search function
CREATE OR REPLACE FUNCTION location_autocomplete(query_text TEXT)
RETURNS TABLE(
  result_type TEXT,      -- 'city' or 'country'
  name TEXT,
  country TEXT,
  country_code TEXT,
  admin1 TEXT,
  flag_emoji TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  population BIGINT
)
LANGUAGE SQL
STABLE
PARALLEL SAFE
AS $$
  WITH ranked_results AS (
    -- ========================================================================
    -- RANKING STRATEGY:
    -- Tier 1-2: Exact matches (country > city for exact matches)
    -- Tier 3: Prefix matches (BOTH cities and countries - population determines order)
    -- Tier 4-5: Alternate names and fuzzy matches
    -- ========================================================================

    -- Tier 1: Exact country name match (HIGHEST PRIORITY)
    -- e.g., "germany" → Germany (country)
    SELECT
      'country' AS result_type,
      co.name,
      co.name AS country,
      co.id AS country_code,
      NULL AS admin1,
      co.flag_emoji,
      co.lat,
      co.lon,
      co.population,
      1 AS match_rank,
      1.0 AS sim_score
    FROM countries co
    WHERE LOWER(co.name_ascii) = LOWER(query_text)

    UNION ALL

    -- Tier 2: Exact city name match
    -- e.g., "paris" → Paris (city)
    SELECT
      'city' AS result_type,
      c.name,
      c.country,
      c.country_code,
      c.admin1,
      c.flag_emoji,
      c.lat,
      c.lon,
      c.population::BIGINT,
      2 AS match_rank,
      1.0 AS sim_score
    FROM cities c
    WHERE LOWER(c.name_ascii) = LOWER(query_text)

    UNION ALL

    -- Tier 3: City prefix match
    -- e.g., "par" → Paris, "berl" → Berlin, "chin" → Chino (cities)
    SELECT
      'city' AS result_type,
      c.name,
      c.country,
      c.country_code,
      c.admin1,
      c.flag_emoji,
      c.lat,
      c.lon,
      c.population::BIGINT,
      3 AS match_rank,
      similarity(lower(c.name_ascii), lower(query_text)) AS sim_score
    FROM cities c
    WHERE c.name_ascii ILIKE query_text || '%'
      AND LOWER(c.name_ascii) != LOWER(query_text)

    UNION ALL

    -- Tier 3: Country prefix match (SAME TIER as cities - population matters!)
    -- e.g., "ger" → Germany, "chin" → China (country with 1.4B beats small cities)
    SELECT
      'country' AS result_type,
      co.name,
      co.name AS country,
      co.id AS country_code,
      NULL AS admin1,
      co.flag_emoji,
      co.lat,
      co.lon,
      co.population,
      3 AS match_rank,
      similarity(lower(co.name_ascii), lower(query_text)) AS sim_score
    FROM countries co
    WHERE co.name_ascii ILIKE query_text || '%'
      AND LOWER(co.name_ascii) != LOWER(query_text)

    UNION ALL

    -- Tier 4: City alternate name prefix match
    -- e.g., "munich" → München
    SELECT
      'city' AS result_type,
      c.name,
      c.country,
      c.country_code,
      c.admin1,
      c.flag_emoji,
      c.lat,
      c.lon,
      c.population::BIGINT,
      4 AS match_rank,
      similarity(lower(alt), lower(query_text)) AS sim_score
    FROM cities c, UNNEST(c.alt_names) AS alt
    WHERE alt ILIKE query_text || '%'

    UNION ALL

    -- Tier 5: Fuzzy trigram match for cities (typos)
    -- e.g., "berln" → Berlin
    SELECT
      'city' AS result_type,
      c.name,
      c.country,
      c.country_code,
      c.admin1,
      c.flag_emoji,
      c.lat,
      c.lon,
      c.population::BIGINT,
      5 AS match_rank,
      similarity(c.name_ascii, query_text) AS sim_score
    FROM cities c
    WHERE similarity(c.name_ascii, query_text) > 0.3
      AND NOT (c.name_ascii ILIKE query_text || '%')

    UNION ALL

    -- Tier 5: Fuzzy match for countries (typos)
    -- e.g., "germny" → Germany
    SELECT
      'country' AS result_type,
      co.name,
      co.name AS country,
      co.id AS country_code,
      NULL AS admin1,
      co.flag_emoji,
      co.lat,
      co.lon,
      co.population,
      5 AS match_rank,
      similarity(co.name_ascii, query_text) AS sim_score
    FROM countries co
    WHERE similarity(co.name_ascii, query_text) > 0.3
      AND NOT (co.name_ascii ILIKE query_text || '%')
  ),
  -- Deduplicate by (result_type, name, country) keeping the best match
  deduped_results AS (
    SELECT
      result_type, name, country, country_code, admin1, flag_emoji, lat, lon, population,
      match_rank, sim_score,
      ROW_NUMBER() OVER (
        PARTITION BY result_type, name, country, COALESCE(admin1, '')
        ORDER BY
          match_rank ASC,              -- Prefer earlier tier matches
          sim_score DESC,               -- Higher similarity within same tier
          population DESC NULLS LAST    -- Larger entity as tiebreaker
      ) AS rn
    FROM ranked_results
  )
  -- Final results ordered by relevance
  SELECT
    result_type, name, country, country_code, admin1, flag_emoji, lat, lon, population
  FROM deduped_results
  WHERE rn = 1  -- Keep only the best match for each unique entity
  ORDER BY
    match_rank ASC,              -- Best matches first
    sim_score DESC,              -- Higher similarity first
    population DESC NULLS LAST,  -- Larger cities/countries first
    name ASC                     -- Alphabetical only as final tiebreaker
  LIMIT 12;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION location_autocomplete(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION location_autocomplete(TEXT) TO authenticated;

-- ============================================================================
-- MIGRATION NOTE
-- ============================================================================
-- The old function was called city_autocomplete(TEXT).
-- The new function is called location_autocomplete(TEXT).
--
-- To maintain backward compatibility, you can create an alias:
--
-- CREATE OR REPLACE FUNCTION city_autocomplete(query_text TEXT)
-- RETURNS TABLE(...) AS $$
--   SELECT * FROM location_autocomplete(query_text)
--   WHERE result_type = 'city';  -- Only return cities
-- $$ LANGUAGE SQL STABLE;
--
-- However, we recommend updating your Edge Function to use location_autocomplete
-- for the full benefits of country search.
-- ============================================================================
