export default async (request) => {
  // Netlify adds IP-derived geo on the request at the edge
  // @ts-ignore
  const g = request.geo || {};
  const geo = {
    country: g.country?.code || '',
    region: g.subdivision?.code || '',
    city: g.city || '',
    latitude: g.latitude || '',
    longitude: g.longitude || '',
    timezone: g.timezone || ''
  };

  // Carry on to the requested page
  const upstream = await fetch(request);
  const res = new Response(upstream.body, upstream);

  const value = encodeURIComponent(JSON.stringify(geo));
  // Share across subdomains (adjust if you only want per-site)
  const domain = '.rosehill.group'; // or omit to keep per-subdomain
  res.headers.append(
    'Set-Cookie',
    `nl_geo=${value}; Path=/; Max-Age=900; SameSite=Lax; Domain=${domain}`
  );

  return res;
};