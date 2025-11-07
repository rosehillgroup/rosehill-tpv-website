-- ============================================================================
-- City Search Testing Queries
-- ============================================================================
-- Run these queries in Supabase SQL Editor after deploying the updated
-- city_autocomplete function to verify the ranking improvements.
-- ============================================================================

-- Test 1: "berlin" - Should show Berlin, Germany first (not Aitape!)
-- Expected: Berlin, Germany (pop ~3.6M) appears at top
SELECT * FROM city_autocomplete('berlin');

-- Test 2: "paris" - Should show Paris, France first
-- Expected: Paris, France (pop ~2.1M) appears at top
SELECT * FROM city_autocomplete('paris');

-- Test 3: "london" - Should show London, UK first
-- Expected: London, England, United Kingdom (pop ~9M) appears at top
SELECT * FROM city_autocomplete('london');

-- Test 4: "new york" - Should show New York City first
-- Expected: New York, New York, USA (pop ~8.3M) appears at top
SELECT * FROM city_autocomplete('new york');

-- Test 5: "spring" - Multiple Springfield cities, sorted by population
-- Expected: Springfield cities ordered by population (IL > MO > MA > OR)
SELECT * FROM city_autocomplete('spring');

-- Test 6: Typo handling - "berln" should still find Berlin
-- Expected: Berlin appears despite missing 'i'
SELECT * FROM city_autocomplete('berln');

-- Test 7: International names - "munich" should find München
-- Expected: München (Munich), Germany appears
SELECT * FROM city_autocomplete('munich');

-- Test 8: "tok" - Should show Tokyo first (population ranking)
-- Expected: Tokyo, Japan (pop ~9M) appears before smaller cities
SELECT * FROM city_autocomplete('tok');

-- Test 9: "san" - Many San* cities, should rank by population
-- Expected: San Antonio, San Diego, San Jose ahead of smaller cities
SELECT * FROM city_autocomplete('san');

-- Test 10: Short query - "a" - Should return diverse high-population cities
-- Expected: Major cities starting with 'A' (Athens, Amsterdam, etc.)
SELECT * FROM city_autocomplete('a');

-- ============================================================================
-- Performance Test - Check query execution time
-- ============================================================================
-- This should complete in under 100ms
EXPLAIN ANALYZE SELECT * FROM city_autocomplete('berlin');

-- ============================================================================
-- Verification of the Problem Fix
-- ============================================================================
-- Before the fix: "berlin" would return Aitape first (alphabetical ordering)
-- After the fix: "berlin" returns Berlin, Germany first (relevance ranking)
--
-- The old query used:
--   SELECT DISTINCT ON (name, country, admin1) ... ORDER BY name, country, admin1, ...
-- Which forced alphabetical ordering ('A' before 'B')
--
-- The new query uses:
--   ROW_NUMBER() OVER (PARTITION BY ... ORDER BY match_rank, sim_score, population)
-- Which properly ranks by relevance first, then population, then alphabetically
-- ============================================================================

-- Debug query: Show all cities matching "berlin" with their ranking
-- This helps understand why results appear in a certain order
WITH ranked_cities AS (
  SELECT
    c.name,
    c.country,
    c.population,
    1 AS match_rank,
    similarity(lower(c.name_ascii), lower('berlin')) AS sim_score
  FROM cities c
  WHERE c.name_ascii ILIKE 'berlin' || '%'

  UNION ALL

  SELECT
    c.name,
    c.country,
    c.population,
    3 AS match_rank,
    similarity(c.name_ascii, 'berlin') AS sim_score
  FROM cities c
  WHERE similarity(c.name_ascii, 'berlin') > 0.3
)
SELECT
  name, country, population, match_rank, sim_score,
  ROW_NUMBER() OVER (ORDER BY match_rank ASC, sim_score DESC, population DESC NULLS LAST) AS final_rank
FROM ranked_cities
ORDER BY match_rank ASC, sim_score DESC, population DESC NULLS LAST
LIMIT 20;

-- ============================================================================
-- Expected Results for "berlin" Query
-- ============================================================================
-- Rank 1: Berlin, Germany (pop: ~3,600,000)
-- Rank 2: Berlin, New Hampshire, USA (if exists in dataset)
-- Rank 3: Other smaller cities named Berlin
--
-- Aitape, Papua New Guinea should NOT appear in top results unless it
-- has an alternate name containing "berlin" (which it doesn't)
-- ============================================================================
