# Global City Search Deployment Guide

This guide walks you through deploying the upgraded city search system with 150,000+ cities.

> **🔄 UPDATED:** The ranking algorithm was improved to fix alphabetical sorting issues. See `CITY_SEARCH_FIX.md` for details about the relevance ranking improvements.

> **🌍 NEW:** Country search is now available! See `COUNTRY_SEARCH_DEPLOY.md` for instructions to add ~250 countries to the search, allowing users to search "Germany", "France", etc.

---

## Prerequisites

- Supabase project with database access
- Supabase CLI installed (`npm install -g supabase`)
- Python 3 with `requests` module
- Your Supabase credentials:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY` (service role key, not anon key)

---

## Step 1: Create Database Schema

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `scripts/city-search-schema.sql`
4. Copy and paste the entire SQL script
5. Click **Run** to execute

**Expected result:**
```
✓ Table 'cities' created
✓ Extension 'pg_trgm' enabled
✓ 4 indexes created
✓ Function 'city_autocomplete' created
✓ Permissions granted
```

---

## Step 2: Import City Data

### Set environment variables

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="your-service-role-key-here"
```

### Run the import script

```bash
cd "/Volumes/Marketing_SSD/Websites 2025/TPV_2025_Deploy"
python3 scripts/import-cities.py
```

**What it does:**
- Downloads ~400MB of GeoNames data (cities, countries, alternate names)
- Processes and filters to cities with population ≥ 5,000
- Enriches with country names, state/province, flag emojis
- Uploads ~150,000 cities to Supabase in batches

**Duration:** ~10-15 minutes depending on connection speed

**Expected output:**
```
Downloading https://download.geonames.org/export/dump/cities5000.zip...
  Downloaded: cities5000.zip (23,456,789 bytes)
Extracting cities5000.zip...
  Extracted: cities5000.txt
...
Loading cities (min population: 5,000)...
  Loaded 147,231 cities
...
Uploading 147,231 cities to Supabase in batches of 1000...
  Uploaded: 147,231 / 147,231 (100.0%)
✓ Successfully uploaded 147,231 cities
```

### Finalize search vectors

After import completes, run this SQL in **Supabase SQL Editor**:

```sql
-- Build full-text search vectors
UPDATE cities
SET search_vector = to_tsvector('simple',
    name || ' ' ||
    name_ascii || ' ' ||
    COALESCE(array_to_string(alt_names, ' '), '')
);

-- Update statistics for query optimizer
ANALYZE cities;
```

**Test the function:**
```sql
SELECT * FROM city_autocomplete('paris');
SELECT * FROM city_autocomplete('münchen');  -- Tests alternate names
SELECT * FROM city_autocomplete('spring');   -- Multiple results
```

---

## Step 3: Deploy Edge Function

### Login to Supabase CLI

```bash
supabase login
```

### Link to your project

```bash
cd "/Volumes/Marketing_SSD/Websites 2025/TPV_2025_Deploy"
supabase link --project-ref your-project-ref
```

(Find your project ref in Supabase dashboard URL: `https://app.supabase.com/project/your-project-ref`)

### Deploy the function

```bash
supabase functions deploy city-search
```

**Expected output:**
```
Deploying function city-search...
✓ Function deployed successfully
Function URL: https://your-project.supabase.co/functions/v1/city-search
```

### Test the Edge Function

```bash
curl "https://your-project.supabase.co/functions/v1/city-search?q=paris" \
  -H "apikey: your-anon-key"
```

**Expected response:**
```json
[
  {
    "name": "Paris",
    "country": "France",
    "country_code": "FR",
    "admin1": "Île-de-France",
    "flag_emoji": "🇫🇷",
    "lat": 48.8566,
    "lon": 2.3522,
    "population": 2138551
  }
]
```

---

## Step 4: Update Frontend

The frontend updates are already in `performance/uv-stability.html`. Key changes:

### Updated city search function (lines ~1240-1280):

```javascript
// New API fetch with fallback
async function fetchCitySuggestions(query) {
  const SUPABASE_URL = 'https://your-project.supabase.co';  // UPDATE THIS
  const SUPABASE_ANON_KEY = 'your-anon-key';  // UPDATE THIS

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/city-search?q=${encodeURIComponent(query)}`,
      {
        signal: controller.signal,
        headers: { 'apikey': SUPABASE_ANON_KEY }
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Edge function failed');
    return await res.json();

  } catch (err) {
    console.warn('City search API unavailable, using static fallback');
    // Fallback to existing cities array
    return cities.filter(c =>
      c.city.toLowerCase().includes(query) ||
      c.country.toLowerCase().includes(query)
    ).slice(0, 12);
  }
}
```

### Updated dropdown rendering (with flag emoji + admin1):

```javascript
dropdown.innerHTML = results.map(city => `
  <div class="city-option" onclick="selectCity(${city.lat}, ${city.lon}, '${city.name}', '${city.country}')">
    <strong>${city.flag_emoji || ''} ${city.name}</strong>
    <small>${city.admin1 ? city.admin1 + ', ' : ''}${city.country}</small>
  </div>
`).join('');
```

**Action required:**
1. Open `performance/uv-stability.html`
2. Find the `SUPABASE_URL` and `SUPABASE_ANON_KEY` placeholders
3. Replace with your actual Supabase credentials
4. Save and deploy

---

## Step 5: Add GeoNames Attribution

GeoNames data requires attribution per CC BY 4.0 license.

Add to your site footer or about page:

```html
<p>
  City data from <a href="https://www.geonames.org/" target="_blank">GeoNames</a> (CC BY 4.0)
</p>
```

---

## Testing Checklist

After deployment, test these scenarios:

- [ ] Search "paris" → shows Paris, France with Île-de-France
- [ ] Search "london" → shows London, UK with England
- [ ] Search "new york" → shows New York, USA with New York state
- [ ] Search "spring" → shows multiple Springfield cities with state disambiguation
- [ ] Search "münchen" → finds Munich (alternate name matching)
- [ ] Search "munich" → also finds München
- [ ] Search with typo "prais" → fuzzy matches Paris
- [ ] Kill Edge Function in Supabase dashboard → verify fallback to static JSON works
- [ ] Test on mobile device → verify debouncing and performance
- [ ] Clear browser cache → verify flag emojis display correctly

---

## Monitoring & Maintenance

### View Edge Function logs

1. Go to Supabase Dashboard → **Edge Functions**
2. Select `city-search`
3. Click **Logs** tab

### Update city data

Cities are relatively static, but to update:

```bash
# Re-run import script (it will replace existing data)
python3 scripts/import-cities.py

# Rebuild search vectors
# Run the UPDATE query from Step 2 in SQL Editor
```

### Performance metrics

Expected performance:
- **Database query**: 20-50ms
- **Edge Function**: 50-150ms (including network)
- **With CDN cache**: 10-30ms for popular searches

Monitor in Supabase Dashboard:
- Database → **Query Performance** → Check `city_autocomplete` function
- Edge Functions → **city-search** → View invocation counts and latency

---

## Troubleshooting

### "cities table does not exist"
- Run Step 1 SQL schema in Supabase SQL Editor

### "function city_autocomplete does not exist"
- Verify Step 1 completed successfully
- Check **SQL Editor** → **History** for errors

### "No results returned"
- Check data was imported: `SELECT COUNT(*) FROM cities;`
- Should return ~147,000 rows
- If 0, re-run Step 2

### "Edge function returns 500 error"
- Check function logs in Supabase dashboard
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set (not anon key)
- Redeploy: `supabase functions deploy city-search`

### "Frontend shows fallback cities only"
- Check browser console for errors
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in HTML
- Test Edge Function with curl (Step 3)
- Check CORS headers if cross-origin

### "Alternate names not working"
- Verify search_vector was built (Step 2 finalization)
- Check: `SELECT name, alt_names FROM cities WHERE name = 'Munich';`
- Should show alt_names array with ['München', ...]

---

## Cost Estimates

Based on Supabase free tier:
- **Database storage**: ~100MB for 150k cities (well within free tier)
- **Edge Function invocations**: 500k/month free (generous for autocomplete)
- **Database queries**: Unlimited on free tier

You'll stay on free tier unless you have **massive traffic** (100k+ searches/day).

---

## Rollback Plan

If something breaks, revert to static JSON:

1. Comment out the `fetchCitySuggestions` async function
2. Keep existing `initializeCitySearch()` with static `cities` array
3. Optionally drop database objects:
   ```sql
   DROP FUNCTION IF EXISTS city_autocomplete(TEXT);
   DROP TABLE IF EXISTS cities;
   ```

---

## Support

- **GeoNames issues**: https://www.geonames.org/
- **Supabase issues**: https://supabase.com/docs
- **Edge Function docs**: https://supabase.com/docs/guides/functions

---

**That's it!** You now have global city search with fuzzy autocomplete and graceful fallback.
