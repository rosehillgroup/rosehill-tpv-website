/**
 * City Search Edge Function
 * ==========================
 * Fast autocomplete API for global city search (150k+ cities).
 * Calls the city_autocomplete() Postgres function with fuzzy matching.
 *
 * Deployment:
 *   supabase functions deploy city-search
 *
 * Usage:
 *   GET /functions/v1/city-search?q=paris
 *
 * Response:
 *   [
 *     {
 *       "name": "Paris",
 *       "country": "France",
 *       "country_code": "FR",
 *       "admin1": "Île-de-France",
 *       "flag_emoji": "🇫🇷",
 *       "lat": 48.8566,
 *       "lon": 2.3522,
 *       "population": 2138551
 *     }
 *   ]
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// CORS headers for browser access
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",  // Or restrict to your domain
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Validate and sanitize query string
 */
function sanitizeQuery(q: string | null): string | null {
  if (!q) return null;

  // Trim whitespace
  q = q.trim();

  // Minimum 2 characters
  if (q.length < 2) return null;

  // Maximum 64 characters (prevent abuse)
  if (q.length > 64) {
    q = q.slice(0, 64);
  }

  // Remove dangerous characters (prevent SQL injection, though Supabase uses parameterized queries)
  // Allow: letters, numbers, spaces, hyphens, apostrophes, accents
  const sanitized = q.replace(/[^\w\s\-'À-ÿ]/gi, '');

  return sanitized || null;
}

/**
 * Main request handler
 */
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Parse query parameter
    const url = new URL(req.url);
    const query = sanitizeQuery(url.searchParams.get("q"));

    // Return empty array if query is invalid
    if (!query) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",  // Cache empty results for 5 minutes
        },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call the city_autocomplete RPC function
    const { data, error } = await supabase.rpc("city_autocomplete", {
      query_text: query,
    });

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    // Return results with caching
    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
        // Cache successful queries for 60 seconds at CDN level
        // This reduces DB load for popular searches
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });

  } catch (error) {
    console.error("City search error:", error);

    // Return 500 with error details
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
});

/**
 * Notes:
 * ------
 * • This Edge Function runs on Deno runtime at the Supabase edge
 * • It's deployed globally across Supabase's CDN
 * • Typical response time: 20-100ms (including DB query)
 * • CDN caching reduces load on the database
 * • Rate limiting is handled by Supabase automatically
 * • Logs are viewable in Supabase dashboard under Functions
 *
 * Testing locally:
 *   supabase functions serve city-search --env-file .env.local
 *   curl "http://localhost:54321/functions/v1/city-search?q=paris"
 *
 * Deployment:
 *   supabase functions deploy city-search --project-ref yourproject
 */
