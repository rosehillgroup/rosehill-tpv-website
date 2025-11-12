# Geo-Cookie Setup for Vite on Vercel

## Issue with Original Approach

The original `middleware.ts` file was designed for Next.js Edge Middleware, which doesn't work with Vite projects on Vercel.

**Error**:
```
Cannot find module 'next/server'
The Edge Function "middleware" is referencing unsupported modules
```

## New Solution: API Endpoint

Instead of Edge Middleware, we use a regular serverless function that the frontend calls.

### Implementation

**Backend**: `/studio/api/geo-cookie.js`
- Regular Vercel serverless function
- Reads geo data from `req.geo` (Vercel provides this)
- Sets `nl_geo` cookie with 15-minute expiry

**Frontend**: Call on app load
```javascript
// In your App.jsx or main component
useEffect(() => {
  // Call geo-cookie endpoint to set cookie
  fetch('/api/geo-cookie')
    .then(res => res.json())
    .then(data => console.log('Geo cookie set:', data.geo))
    .catch(err => console.error('Geo cookie failed:', err));
}, []);
```

### Cookie Details

- **Name**: `nl_geo`
- **Value**: JSON string with geo data (URL encoded)
- **Expiry**: 900 seconds (15 minutes)
- **Domain**: `.rosehill.group` (production only)
- **SameSite**: Lax
- **Secure**: Yes

### Usage

Read the cookie in your application:
```javascript
function getGeoCookie() {
  const cookies = document.cookie.split(';');
  const geoCookie = cookies.find(c => c.trim().startsWith('nl_geo='));

  if (geoCookie) {
    const value = geoCookie.split('=')[1];
    const geoData = JSON.parse(decodeURIComponent(value));
    return geoData;
  }

  return null;
}

// Example usage
const geo = getGeoCookie();
console.log('User country:', geo?.country);
console.log('User city:', geo?.city);
```

### Comparison: Edge Middleware vs. Serverless Function

| Feature | Edge Middleware (Next.js) | Serverless Function (Vite) |
|---------|---------------------------|----------------------------|
| **Availability** | Next.js only | All frameworks |
| **Execution** | On every request (automatic) | On explicit API call |
| **Performance** | Slightly faster (edge) | Fast (serverless, <50ms) |
| **Geo Data** | ✅ Available | ✅ Available |
| **Cookie Setting** | ✅ Automatic | ⚠️ Requires frontend call |

### Alternative: Client-Side Only

If the geo cookie is not critical, you can also handle it entirely client-side:

```javascript
// Get geo data from Vercel's analytics (if enabled)
// Or use a third-party service like ipapi.co

useEffect(() => {
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      const geo = {
        country: data.country_code,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude
      };

      // Store in localStorage or state
      localStorage.setItem('geo', JSON.stringify(geo));
    });
}, []);
```

### Recommendation

For the TPV Studio app, if geo data is not critical for functionality:
- **Option 1**: Keep the `/api/geo-cookie` endpoint and call it on app load
- **Option 2**: Skip geo tracking entirely for now

The app will work fine without geo data. Add it back later if needed for analytics or regional features.

---

**Status**: ✅ Middleware removed, API endpoint created as alternative
