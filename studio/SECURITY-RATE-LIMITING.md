# Rate Limiting Setup Guide for TPV Studio

## CRITICAL: This Must Be Implemented Before Customer Launch

Rate limiting is essential to prevent cost attacks where malicious users spam expensive AI operations (Recraft generation, vectorization, Claude API calls).

**Current Risk:** Authenticated users can still spam generations without limit, potentially costing hundreds of dollars per hour.

---

## Option 1: Upstash Redis (Recommended - Simplest)

### Step 1: Create Upstash Account
1. Go to https://upstash.com/
2. Sign up for free account (10,000 commands/day free tier)
3. Create new Redis database (select region closest to your Vercel deployment)
4. Copy the REST URL and REST TOKEN

### Step 2: Install Dependencies
```bash
cd studio
npm install @upstash/ratelimit @upstash/redis
```

### Step 3: Add Environment Variables
Add to Vercel:
```
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

### Step 4: Create Rate Limiting Middleware
Create `studio/middleware.js`:

```javascript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
  analytics: true,
  prefix: 'tpv_ratelimit',
});

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Rate limit expensive AI endpoints
  const expensiveEndpoints = [
    '/api/recraft-generate',
    '/api/recraft-vectorize',
    '/api/vectorise',
    '/api/generate-design-name',
    '/api/export-pdf'
  ];

  if (expensiveEndpoints.some(endpoint => pathname.startsWith(endpoint))) {
    // Use user ID or IP as identifier
    const userId = request.headers.get('x-user-id') || request.ip || 'anonymous';

    const { success, limit, reset, remaining } = await ratelimit.limit(userId);

    if (!success) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          limit,
          remaining,
          reset: new Date(reset).toISOString(),
          message: `You've reached the limit of ${limit} generations per hour. Please try again after ${new Date(reset).toLocaleTimeString()}.`
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }

    // Add rate limit headers to successful requests
    const response = Response.next();
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());

    return response;
  }

  return Response.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

### Step 5: Deploy
```bash
git add middleware.js package.json package-lock.json
git commit -m "Add rate limiting with Upstash Redis"
git push
```

---

## Option 2: Vercel KV (If Already Using Vercel Pro/Enterprise)

If you're on Vercel Pro/Enterprise plan, you can use Vercel KV instead:

### Step 1: Enable Vercel KV
```bash
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN
```

### Step 2: Same as Option 1 Steps 2-5
The code is identical - Upstash powers Vercel KV under the hood.

---

## Option 3: Database-Based Rate Limiting (Free, Slower)

If you want to avoid external dependencies, use Supabase for rate limiting:

### Create Rate Limit Table
```sql
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint, window_start)
);

CREATE INDEX idx_rate_limits_user_endpoint
ON rate_limits(user_id, endpoint, window_start);
```

### Add Helper Function
Create `studio/api/_utils/rateLimit.js`:

```javascript
import { getSupabaseServiceClient } from './supabase.js';

const RATE_LIMITS = {
  '/api/recraft-generate': { requests: 10, windowMinutes: 60 },
  '/api/recraft-vectorize': { requests: 10, windowMinutes: 60 },
  '/api/vectorise': { requests: 10, windowMinutes: 60 },
  '/api/generate-design-name': { requests: 50, windowMinutes: 60 },
  '/api/export-pdf': { requests: 20, windowMinutes: 60 },
};

export async function checkRateLimit(userId, endpoint) {
  const supabase = getSupabaseServiceClient();
  const limit = RATE_LIMITS[endpoint];

  if (!limit) return { allowed: true };

  const windowStart = new Date(Date.now() - limit.windowMinutes * 60 * 1000);

  // Count requests in current window
  const { data, error } = await supabase
    .from('rate_limits')
    .select('request_count')
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart.toISOString())
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[RATE-LIMIT] Check failed:', error);
    return { allowed: true }; // Fail open
  }

  if (data && data.request_count >= limit.requests) {
    return {
      allowed: false,
      limit: limit.requests,
      remaining: 0,
      reset: new Date(Date.now() + limit.windowMinutes * 60 * 1000).toISOString()
    };
  }

  // Increment or create record
  if (data) {
    await supabase
      .from('rate_limits')
      .update({ request_count: data.request_count + 1 })
      .eq('user_id', userId)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString());
  } else {
    await supabase
      .from('rate_limits')
      .insert({
        user_id: userId,
        endpoint,
        request_count: 1,
        window_start: new Date().toISOString()
      });
  }

  return {
    allowed: true,
    limit: limit.requests,
    remaining: limit.requests - (data?.request_count || 0) - 1
  };
}
```

### Apply to Endpoints
Add to each expensive endpoint (e.g., `api/recraft-generate.js`):

```javascript
import { checkRateLimit } from './_utils/rateLimit.js';

// After authentication check:
const rateLimitCheck = await checkRateLimit(user.id, '/api/recraft-generate');

if (!rateLimitCheck.allowed) {
  return res.status(429).json({
    error: 'Rate limit exceeded',
    limit: rateLimitCheck.limit,
    remaining: rateLimitCheck.remaining,
    reset: rateLimitCheck.reset,
    message: 'You have reached the limit for generations. Please try again later.'
  });
}
```

---

## Recommended Rate Limits

Based on typical usage patterns and cost analysis:

| Endpoint | Limit | Window | Cost per Request | Max Cost/Hour |
|----------|-------|--------|------------------|---------------|
| /api/recraft-generate | 10 | 1 hour | $0.10 | $1.00 |
| /api/recraft-vectorize | 10 | 1 hour | $0.10 | $1.00 |
| /api/vectorise | 10 | 1 hour | $0.05 | $0.50 |
| /api/generate-design-name | 50 | 1 hour | $0.001 | $0.05 |
| /api/export-pdf | 20 | 1 hour | $0.00 | $0.00 |

**Total maximum cost per user per hour:** ~$2.55

With 100 concurrent users at max rate: $255/hour = ~$6,000/day

**Adjust limits based on your budget and expected usage!**

---

## Testing Rate Limits

### Manual Test
```bash
# Test generation endpoint
for i in {1..12}; do
  curl -X POST https://your-domain.com/api/recraft-generate \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -d '{"prompt": "test", "width_mm": 5000, "length_mm": 5000}' \
    && echo "Request $i succeeded" \
    || echo "Request $i failed"
  sleep 1
done
```

Expected: First 10 succeed, requests 11-12 return 429.

### Frontend Handling
Update your frontend to handle 429 responses:

```javascript
// In your API call handler
if (response.status === 429) {
  const data = await response.json();
  const resetTime = new Date(data.reset);
  showError(
    `Rate limit reached. You can generate ${data.remaining}/${data.limit} more designs. ` +
    `Limit resets at ${resetTime.toLocaleTimeString()}.`
  );
  return;
}
```

---

## Monitoring

### Upstash Dashboard
- View request counts per user
- See rate limit triggers
- Monitor costs

### Custom Monitoring
Add to each rate-limited endpoint:

```javascript
console.log('[RATE-LIMIT]', {
  userId: user.id,
  endpoint: req.url,
  allowed: rateLimitCheck.allowed,
  remaining: rateLimitCheck.remaining,
  timestamp: new Date().toISOString()
});
```

Query logs in Vercel dashboard to identify:
- Users hitting limits frequently (possible attackers)
- Legitimate power users who need higher limits
- Optimal limit values based on actual usage

---

## Go-Live Checklist

Before launching to customers:

- [ ] Rate limiting implemented (Option 1, 2, or 3)
- [ ] Environment variables configured in Vercel
- [ ] Rate limits tested manually
- [ ] Frontend handles 429 responses gracefully
- [ ] Monitoring/alerting configured
- [ ] Team notified of daily cost caps
- [ ] Admin interface to adjust limits per user (optional but recommended)
- [ ] Documentation for users about rate limits

---

## Emergency: Disable Expensive Endpoints

If you're getting a cost attack before rate limiting is set up:

### Quick Fix - Comment Out Endpoint Logic
```javascript
// In api/recraft-generate.js
export default async function handler(req, res) {
  return res.status(503).json({
    error: 'Service temporarily unavailable',
    message: 'Generation endpoint is under maintenance. Please try again later.'
  });
}
```

### Better - Add Manual Feature Flag
Add to `.env`:
```
ENABLE_AI_GENERATION=false
```

Check in each endpoint:
```javascript
if (process.env.ENABLE_AI_GENERATION !== 'true') {
  return res.status(503).json({
    error: 'Service temporarily unavailable'
  });
}
```

Re-enable after rate limiting is set up.
