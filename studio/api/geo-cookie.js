// Geo-location Cookie API (Vercel Serverless Function)
// Alternative to Edge Middleware for Vite projects
// Call this endpoint on app load to set geo cookie

export default async function handler(req, res) {
  // Get geo data from Vercel's request object
  const geo = {
    country: req.geo?.country || '',
    region: req.geo?.region || '',
    city: req.geo?.city || '',
    latitude: req.geo?.latitude || '',
    longitude: req.geo?.longitude || '',
    timezone: req.geo?.timezone || ''
  };

  // Encode geo data as JSON string
  const geoValue = encodeURIComponent(JSON.stringify(geo));

  // Set cookie with 15-minute expiry (900 seconds)
  const isProduction = process.env.VERCEL_ENV === 'production';
  const cookieOptions = [
    `nl_geo=${geoValue}`,
    'Path=/',
    'Max-Age=900',
    'SameSite=Lax',
    'Secure'
  ];

  if (isProduction) {
    cookieOptions.push('Domain=.rosehill.group');
  }

  res.setHeader('Set-Cookie', cookieOptions.join('; '));

  return res.status(200).json({
    ok: true,
    geo
  });
}
