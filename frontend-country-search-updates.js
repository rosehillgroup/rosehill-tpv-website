/**
 * Frontend Updates for Country Search
 * =====================================
 * These code snippets update uv-stability.html to support country search.
 *
 * INSTRUCTIONS:
 * 1. Find the indicated sections in performance/uv-stability.html
 * 2. Replace with the updated code below
 */

// ============================================================================
// UPDATE 1: Dropdown Rendering (around line 1437)
// ============================================================================
// FIND this code:
/*
dropdown.innerHTML = results.map(city => {
    const locationParts = [];
    if (city.admin1) locationParts.push(city.admin1);
    locationParts.push(city.country);
    const location = locationParts.join(', ');

    return `
        <div class="city-option" onclick="selectCity(${city.lat}, ${city.lon}, '${city.name.replace(/'/g, "\\'")}', '${city.country.replace(/'/g, "\\'")}')">
            <strong>${city.flag_emoji || ''} ${city.name}</strong>
            <small>${location}</small>
        </div>
    `;
}).join('');
*/

// REPLACE with:
dropdown.innerHTML = results.map(result => {
    const isCountry = result.result_type === 'country';

    let locationText = '';
    if (isCountry) {
        // For countries, show continent or capital
        locationText = result.admin1 || result.continent || 'Country';
    } else {
        // For cities, show state/province and country
        const locationParts = [];
        if (result.admin1) locationParts.push(result.admin1);
        locationParts.push(result.country);
        locationText = locationParts.join(', ');
    }

    // Add visual indicator for countries (globe icon)
    const typeIcon = isCountry ? '🌍 ' : '';

    return `
        <div class="city-option ${isCountry ? 'country-option' : ''}"
             onclick="selectLocation(${result.lat}, ${result.lon}, '${result.name.replace(/'/g, "\\'")}', '${result.country.replace(/'/g, "\\'")}', '${result.result_type}')">
            <strong>${typeIcon}${result.flag_emoji || ''} ${result.name}</strong>
            <small>${locationText}</small>
        </div>
    `;
}).join('');


// ============================================================================
// UPDATE 2: CSS for Country Options (add to <style> section around line 300)
// ============================================================================
// ADD this CSS after the .city-option styles:
/*
.country-option {
    background: linear-gradient(90deg, rgba(255, 107, 53, 0.05) 0%, transparent 100%);
    border-left: 3px solid #ff6b35;
}

.country-option:hover {
    background: linear-gradient(90deg, rgba(255, 107, 53, 0.1) 0%, #f8f9fa 100%);
}
*/


// ============================================================================
// UPDATE 3: Replace selectCity with selectLocation (around line 1470)
// ============================================================================
// FIND this function:
/*
function selectCity(lat, lon, city, country) {
    document.getElementById('cityDropdown').classList.remove('active');
    document.getElementById('citySearch').value = `${city}, ${country}`;
    map.flyTo({ center: [lon, lat], zoom: 5 });
    handleLocationSelect(lat, lon, `${city}, ${country}`);
    trackEvent('location_select', { city, country });
}
*/

// REPLACE with:
function selectLocation(lat, lon, name, country, resultType) {
    document.getElementById('cityDropdown').classList.remove('active');
    document.getElementById('citySearch').value = resultType === 'country' ? name : `${name}, ${country}`;

    // Different zoom levels for cities vs countries
    const zoom = resultType === 'country' ? 3.5 : 5;
    map.flyTo({ center: [lon, lat], zoom: zoom });

    handleLocationSelect(lat, lon, resultType === 'country' ? name : `${name}, ${country}`);
    trackEvent('location_select', { name, country, type: resultType });
}

// ============================================================================
// UPDATE 4: Fallback for Old selectCity Calls (add after selectLocation)
// ============================================================================
// ADD this backward compatibility function:
// This ensures old code still works if there are any references to selectCity
function selectCity(lat, lon, city, country) {
    selectLocation(lat, lon, city, country, 'city');
}


// ============================================================================
// UPDATE 5: Update Fallback City Search (around line 1398)
// ============================================================================
// FIND this fallback code in fetchCitySuggestions:
/*
return cities.filter(c =>
    c.city.toLowerCase().includes(query.toLowerCase()) ||
    c.country.toLowerCase().includes(query.toLowerCase())
).slice(0, 12).map(c => ({
    name: c.city,
    country: c.country,
    lat: c.lat,
    lon: c.lon,
    admin1: null,
    flag_emoji: null
}));
*/

// REPLACE with:
return cities.filter(c =>
    c.city.toLowerCase().includes(query.toLowerCase()) ||
    c.country.toLowerCase().includes(query.toLowerCase())
).slice(0, 12).map(c => ({
    result_type: 'city',  // Add result_type for consistency
    name: c.city,
    country: c.country,
    lat: c.lat,
    lon: c.lon,
    admin1: null,
    flag_emoji: null
}));


// ============================================================================
// SUMMARY OF CHANGES
// ============================================================================
/*
1. Dropdown now shows countries with a globe icon (🌍) and special styling
2. Countries have an orange left border to distinguish them from cities
3. selectLocation replaces selectCity and handles both types
4. Countries zoom out more (zoom level 3.5 vs 5 for cities)
5. Search input shows just country name for countries, or "City, Country" for cities
6. Fallback search includes result_type field for consistency
7. Backward compatibility maintained with selectCity wrapper function

TESTING:
- Search "germany" → Should show 🌍 🇩🇪 Germany with orange border
- Search "paris" → Should show Paris, France (city) and potentially Paraguay (country)
- Search "united" → Should show United Kingdom, United States, etc.
- Click country → Should zoom to show whole country
- Click city → Should zoom to city level
*/
