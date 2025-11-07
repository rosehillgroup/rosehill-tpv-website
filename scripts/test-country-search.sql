-- ============================================================================
-- Country + City Search Testing Queries
-- ============================================================================
-- Run these queries in Supabase SQL Editor after deploying the location_autocomplete
-- function to verify both city and country search work correctly.
-- ============================================================================

-- Test 1: Search for "germany" - Should return Germany (country) and German cities
SELECT * FROM location_autocomplete('germany');
-- Expected: Germany (country) + cities like Germering, etc.

-- Test 2: Search for "france" - Should return France (country) and maybe French cities
SELECT * FROM location_autocomplete('france');
-- Expected: France (country) appears prominently

-- Test 3: Search for "united" - Should return United Kingdom, United States, UAE
SELECT * FROM location_autocomplete('united');
-- Expected: Multiple countries with "United" in their name

-- Test 4: Search for "paris" - Should return Paris (city) and potentially Paraguay (country)
SELECT * FROM location_autocomplete('paris');
-- Expected: Paris, France (city) first, then other cities named Paris

-- Test 5: Search for "aus" - Should return Australia (country) and Austrian cities
SELECT * FROM location_autocomplete('aus');
-- Expected: Mix of countries (Australia, Austria) and cities (Austin, etc.)

-- Test 6: Search for "new" - Should return cities like New York, New Delhi
SELECT * FROM location_autocomplete('new');
-- Expected: Cities starting with "New", possibly New Zealand (country)

-- Test 7: Search for "can" - Should return Canada (country) and cities like Canberra
SELECT * FROM location_autocomplete('can');
-- Expected: Canada (country) + cities starting with "Can"

-- Test 8: Search for "mexi" - Should return Mexico (country) and Mexican cities
SELECT * FROM location_autocomplete('mexi');
-- Expected: Mexico (country) + cities like Mexico City

-- Test 9: Exact country match - "brazil"
SELECT * FROM location_autocomplete('brazil');
-- Expected: Brazil (country) first, Brazilian cities after

-- Test 10: Partial country match - "jap"
SELECT * FROM location_autocomplete('jap');
-- Expected: Japan (country) + Japanese cities

-- ============================================================================
-- Verify Result Types
-- ============================================================================
-- Check that results have correct result_type field
SELECT result_type, COUNT(*) as count
FROM location_autocomplete('germany')
GROUP BY result_type;
-- Expected: Both 'city' and 'country' result types

-- ============================================================================
-- Verify Ranking: Countries vs Cities
-- ============================================================================
-- When searching for a country name, the country should appear prominently
SELECT result_type, name, country, population
FROM location_autocomplete('france')
ORDER BY population DESC;
-- Expected: France (country with ~67M population) near the top

-- ============================================================================
-- Verify Mixed Results
-- ============================================================================
-- Query "ind" should return India (country) + cities like Indianapolis
SELECT result_type, name, country, population
FROM location_autocomplete('ind');
-- Expected: Mix of India (country), Indonesian cities, Indian cities, Indianapolis

-- ============================================================================
-- Edge Cases
-- ============================================================================

-- Test 11: Very short query - "us"
SELECT * FROM location_autocomplete('us');
-- Expected: United States (country) + cities starting with "Us"

-- Test 12: Accented characters - "méxico"
SELECT * FROM location_autocomplete('méxico');
-- Expected: Mexico (country) found via accent-insensitive search

-- Test 13: Country code - "gb" (should NOT match, we search names not codes)
SELECT * FROM location_autocomplete('gb');
-- Expected: Cities starting with "gb" (e.g., Gbadolite), not United Kingdom

-- Test 14: Typo in country name - "germny"
SELECT * FROM location_autocomplete('germny');
-- Expected: Germany found via fuzzy matching (if similarity > 0.3)

-- Test 15: Full country name - "United Kingdom"
SELECT * FROM location_autocomplete('United Kingdom');
-- Expected: United Kingdom (country) first

-- ============================================================================
-- Performance Test
-- ============================================================================
EXPLAIN ANALYZE SELECT * FROM location_autocomplete('germany');
-- Expected execution time: < 100ms
-- Check that indexes are being used efficiently

-- ============================================================================
-- Data Quality Checks
-- ============================================================================

-- Check countries table has data
SELECT COUNT(*) as total_countries FROM countries;
-- Expected: ~250 countries

-- Check countries have coordinates
SELECT COUNT(*) as countries_with_coords
FROM countries
WHERE lat != 0.0 OR lon != 0.0;
-- Expected: Most countries should have coordinates

-- Check search vectors are built
SELECT COUNT(*) as countries_with_search_vector
FROM countries
WHERE search_vector IS NOT NULL;
-- Expected: All countries after running UPDATE search_vector query

-- Sample some countries to verify data quality
SELECT id, name, capital, population, flag_emoji, lat, lon
FROM countries
WHERE id IN ('US', 'GB', 'DE', 'FR', 'JP', 'CN', 'IN', 'BR', 'AU')
ORDER BY name;
-- Expected: All major countries present with correct data

-- ============================================================================
-- Integration Test: Fallback to Cities Only
-- ============================================================================
-- If countries table is empty or function not updated, verify cities still work
SELECT result_type, COUNT(*) as count
FROM location_autocomplete('berlin')
GROUP BY result_type;
-- Expected: At minimum, 'city' results (Berlin) even if countries table is empty

-- ============================================================================
-- Validation Summary
-- ============================================================================
-- After running all tests, verify:
-- ✓ Countries appear in search results with result_type='country'
-- ✓ Countries rank appropriately (exact matches prioritized)
-- ✓ Cities still work as before with result_type='city'
-- ✓ Mixed results (e.g., "paris" returns city + Paraguay) work correctly
-- ✓ Fuzzy matching works for both cities and countries
-- ✓ Queries complete in < 100ms
-- ✓ All countries have flag_emoji and coordinates
-- ============================================================================
