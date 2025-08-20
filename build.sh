#!/bin/bash
set -e

echo "Building TPV site..."
echo "Google Maps API Key: ${GOOGLE_MAPS_API_KEY:0:10}..."

# Replace the placeholder with the actual API key
if [ -n "$GOOGLE_MAPS_API_KEY" ]; then
    sed -i "s/GOOGLE_MAPS_API_KEY/$GOOGLE_MAPS_API_KEY/g" contact.html
    echo "API key replacement completed"
else
    echo "WARNING: GOOGLE_MAPS_API_KEY environment variable not set"
fi

# Install function dependencies
echo "Installing function dependencies..."
cd netlify/functions
npm install
cd ../..

# Generate installation pages if Supabase credentials are available
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_ANON_KEY" ]; then
    echo "Generating installation pages..."
    node generate-installation-pages-supabase.cjs || echo "Warning: Installation page generation failed (this is non-critical)"
else
    echo "Skipping installation page generation (Supabase credentials not available)"
fi

echo "Build completed successfully"