#!/usr/bin/env python3
"""
GeoNames Country Data Importer for Supabase
============================================

Downloads and imports ~250 countries from GeoNames into Supabase
for autocomplete search alongside cities.

Requirements:
    pip install requests

Usage:
    export SUPABASE_URL="https://yourproject.supabase.co"
    export SUPABASE_SERVICE_KEY="your-service-role-key"
    python3 import-countries.py

Data source:
    - countryInfo.txt from GeoNames.org
    - alternateNamesV2.txt for alternate country names

License: CC BY 4.0 (attribution required for GeoNames data)
"""

import os
import sys
import json
import urllib.request
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Optional
import unicodedata

# Configuration
GEONAMES_BASE = "https://download.geonames.org/export/dump/"
DATA_DIR = Path("./geonames_data")
BATCH_SIZE = 50

# GeoNames file URLs
URLS = {
    "countries": f"{GEONAMES_BASE}countryInfo.txt",
    "alt_names": f"{GEONAMES_BASE}alternateNamesV2.zip",
}

def country_code_to_flag(code: str) -> str:
    """Convert ISO country code to flag emoji (e.g. 'US' -> '🇺🇸')"""
    if len(code) != 2:
        return ""
    return "".join(chr(127397 + ord(c)) for c in code.upper())

def strip_accents(text: str) -> str:
    """Normalize Unicode string to ASCII"""
    return ''.join(
        c for c in unicodedata.normalize('NFD', text)
        if unicodedata.category(c) != 'Mn'
    )

def download_file(url: str, dest: Path) -> None:
    """Download a file with progress indicator"""
    print(f"Downloading {url}...")
    dest.parent.mkdir(parents=True, exist_ok=True)

    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

    with urllib.request.urlopen(req) as response:
        total_size = int(response.headers.get('content-length', 0))
        block_size = 8192
        downloaded = 0

        with open(dest, 'wb') as f:
            while True:
                chunk = response.read(block_size)
                if not chunk:
                    break
                downloaded += len(chunk)
                f.write(chunk)

                if total_size > 0:
                    pct = (downloaded / total_size) * 100
                    print(f"  Progress: {pct:.1f}%", end='\r')

        print(f"  Downloaded: {dest.name} ({downloaded:,} bytes)")

def load_countries() -> List[Dict]:
    """Load country data from countryInfo.txt"""
    country_file = DATA_DIR / "countryInfo.txt"

    if not country_file.exists():
        download_file(URLS["countries"], country_file)

    print(f"\nLoading countries...")
    countries = []
    skipped = 0

    with open(country_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()

            # Skip comments and empty lines
            if line.startswith('#') or not line:
                continue

            parts = line.split('\t')
            if len(parts) < 17:  # Reduced from 19 to 17 (only need up to geoname_id at index 16)
                skipped += 1
                continue

            # Parse country data
            # Format: ISO, ISO3, ISO-Numeric, fips, Country, Capital, Area(km2),
            #         Population, Continent, tld, CurrencyCode, CurrencyName, Phone,
            #         Postal Code Format, Postal Code Regex, Languages, geonameid,
            #         neighbours, EquivalentFipsCode

            iso2 = parts[0].strip()
            name = parts[4].strip()
            capital = parts[5].strip()
            area = parts[6].strip()
            population = parts[7].strip()
            continent = parts[8].strip()
            geoname_id = parts[16].strip()

            if not iso2 or not name:
                continue

            try:
                countries.append({
                    'id': iso2,
                    'name': name,
                    'name_ascii': strip_accents(name),
                    'continent': continent or None,
                    'capital': capital or None,
                    'area_km2': float(area) if area and area != '' else None,
                    'population': int(population) if population and population != '' else None,
                    'geoname_id': int(geoname_id) if geoname_id else None,
                    'flag_emoji': country_code_to_flag(iso2),
                    'lat': 0.0,  # Will be populated from GeoNames API or cities
                    'lon': 0.0,
                    'alt_names': []
                })
            except Exception as e:
                print(f"  Warning: Failed to parse country {iso2} ({name}): {e}")
                skipped += 1
                continue

    print(f"  Loaded {len(countries)} countries (skipped {skipped} lines)")
    return countries

def enrich_country_coordinates(countries: List[Dict]) -> None:
    """
    Enrich countries with center coordinates using GeoNames API.
    Falls back to manual coordinates for common countries if API fails.
    """
    print("\nEnriching country coordinates...")

    # Manual fallback coordinates for major countries (geographic center or capital)
    FALLBACK_COORDS = {
        'US': (39.8283, -98.5795),  # United States
        'GB': (54.7024, -3.2766),   # United Kingdom
        'DE': (51.1657, 10.4515),   # Germany
        'FR': (46.2276, 2.2137),    # France
        'IT': (41.8719, 12.5674),   # Italy
        'ES': (40.4637, -3.7492),   # Spain
        'CA': (56.1304, -106.3468), # Canada
        'AU': (-25.2744, 133.7751), # Australia
        'JP': (36.2048, 138.2529),  # Japan
        'CN': (35.8617, 104.1954),  # China
        'IN': (20.5937, 78.9629),   # India
        'BR': (-14.2350, -51.9253), # Brazil
        'MX': (23.6345, -102.5528), # Mexico
        'RU': (61.5240, 105.3188),  # Russia
        'ZA': (-30.5595, 22.9375),  # South Africa
    }

    for country in countries:
        code = country['id']

        # Try fallback coordinates first
        if code in FALLBACK_COORDS:
            country['lat'], country['lon'] = FALLBACK_COORDS[code]
        elif country['geoname_id']:
            # Try to fetch from GeoNames API
            try:
                url = f"http://api.geonames.org/getJSON?geonameId={country['geoname_id']}&username=demo"
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=5) as response:
                    data = json.loads(response.read())
                    if 'lat' in data and 'lng' in data:
                        country['lat'] = float(data['lat'])
                        country['lon'] = float(data['lng'])
            except Exception as e:
                # Skip API errors, keep default 0,0
                pass

    populated = sum(1 for c in countries if c['lat'] != 0.0 or c['lon'] != 0.0)
    print(f"  Enriched {populated}/{len(countries)} countries with coordinates")

def upload_to_supabase(countries: List[Dict]) -> None:
    """Upload countries to Supabase in batches"""
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_SERVICE_KEY')

    if not supabase_url or not supabase_key:
        print("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables")
        sys.exit(1)

    print(f"\nUploading {len(countries)} countries to Supabase...")

    # Upload in batches
    for i in range(0, len(countries), BATCH_SIZE):
        batch = countries[i:i+BATCH_SIZE]

        # Prepare payload
        payload = json.dumps(batch).encode('utf-8')

        # Make request
        url = f"{supabase_url}/rest/v1/countries"
        req = urllib.request.Request(
            url,
            data=payload,
            headers={
                'apikey': supabase_key,
                'Authorization': f'Bearer {supabase_key}',
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            method='POST'
        )

        try:
            with urllib.request.urlopen(req) as response:
                if response.status not in (200, 201):
                    print(f"\nERROR: Upload failed with status {response.status}")
                    print(response.read().decode('utf-8'))
                    sys.exit(1)
        except urllib.error.HTTPError as e:
            print(f"\nERROR: HTTP {e.code}")
            print(e.read().decode('utf-8'))
            sys.exit(1)

        print(f"  Uploaded: {min(i+BATCH_SIZE, len(countries))}/{len(countries)} ({(min(i+BATCH_SIZE, len(countries))/len(countries)*100):.1f}%)")

    print(f"✓ Successfully uploaded {len(countries)} countries")

def main():
    """Main import process"""
    print("=" * 70)
    print("GeoNames Country Data Importer")
    print("=" * 70)

    # Ensure data directory exists
    DATA_DIR.mkdir(exist_ok=True)

    # Load country data
    countries = load_countries()

    # Enrich with coordinates
    enrich_country_coordinates(countries)

    # Upload to Supabase
    upload_to_supabase(countries)

    print("\n" + "=" * 70)
    print("✓ Import complete!")
    print("=" * 70)
    print("\nNext steps:")
    print("1. Run the following SQL in Supabase SQL Editor to build search vectors:")
    print()
    print("   UPDATE countries")
    print("   SET search_vector = to_tsvector('simple',")
    print("       name || ' ' || name_ascii || ' ' ||")
    print("       COALESCE(array_to_string(alt_names, ' '), '')")
    print("   );")
    print()
    print("   ANALYZE countries;")
    print()
    print("2. Deploy the updated autocomplete function (city-and-country-search.sql)")
    print("3. Update the frontend to handle country results")

if __name__ == '__main__':
    main()
