#!/usr/bin/env python3
"""
GeoNames City Data Importer for Supabase
=========================================

Downloads and imports ~150,000 cities (population ≥ 5,000) from GeoNames
into Supabase Postgres with fuzzy search support.

Requirements:
    pip install requests unicodedata2

Usage:
    export SUPABASE_URL="https://yourproject.supabase.co"
    export SUPABASE_SERVICE_KEY="your-service-role-key"
    python3 import-cities.py

Data sources (GeoNames.org):
    - cities5000.txt: Cities with population ≥ 5,000
    - alternateNamesV2.txt: Alternate city name spellings
    - countryInfo.txt: Country names
    - admin1CodesASCII.txt: State/province names

License: CC BY 4.0 (attribution required for GeoNames data)
"""

import os
import sys
import csv
import gzip
import json
import urllib.request
import urllib.parse
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Optional
import unicodedata

# Configuration
GEONAMES_BASE = "https://download.geonames.org/export/dump/"
DATA_DIR = Path("./geonames_data")
MIN_POPULATION = 5000
BATCH_SIZE = 1000  # Insert batch size for Supabase

# GeoNames file URLs
URLS = {
    "cities": f"{GEONAMES_BASE}cities5000.zip",
    "alt_names": f"{GEONAMES_BASE}alternateNamesV2.zip",
    "countries": f"{GEONAMES_BASE}countryInfo.txt",
    "admin1": f"{GEONAMES_BASE}admin1CodesASCII.txt",
}

# ISO 3166-1 alpha-2 to flag emoji mapping
def country_code_to_flag(code: str) -> str:
    """Convert ISO country code to flag emoji (e.g. 'US' -> '🇺🇸')"""
    if len(code) != 2:
        return ""
    return "".join(chr(127397 + ord(c)) for c in code.upper())

def strip_accents(text: str) -> str:
    """
    Normalize Unicode string to ASCII (München -> Munchen).
    Used for name_ascii field to enable accent-insensitive search.
    """
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

def extract_zip(zip_path: Path) -> Path:
    """Extract a GeoNames .zip file (may contain multiple .txt files)"""
    import zipfile

    print(f"Extracting {zip_path.name}...")

    with zipfile.ZipFile(zip_path, 'r') as zf:
        txt_files = [n for n in zf.namelist() if n.endswith('.txt')]

        # For alternateNamesV2.zip, we want the large file, not iso-languagecodes.txt
        # Sort by file size (largest first) and take the first one
        txt_files_sorted = sorted(txt_files, key=lambda f: zf.getinfo(f).file_size, reverse=True)
        txt_file = txt_files_sorted[0]

        zf.extract(txt_file, zip_path.parent)
        extracted = zip_path.parent / txt_file
        print(f"  Extracted: {extracted.name} ({zf.getinfo(txt_file).file_size:,} bytes)")
        return extracted

def load_countries(path: Path) -> Dict[str, str]:
    """
    Load country code -> country name mapping from countryInfo.txt
    Returns: {'US': 'United States', 'GB': 'United Kingdom', ...}
    """
    print("Loading country info...")
    countries = {}

    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith('#'):
                continue
            parts = line.strip().split('\t')
            if len(parts) < 5:
                continue
            code = parts[0]  # ISO alpha-2
            name = parts[4]  # Country name
            countries[code] = name

    print(f"  Loaded {len(countries)} countries")
    return countries

def load_admin1(path: Path) -> Dict[str, str]:
    """
    Load admin1 code -> admin1 name mapping (states/provinces)
    Returns: {'US.CA': 'California', 'GB.ENG': 'England', ...}
    """
    print("Loading admin1 codes...")
    admin1 = {}

    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            parts = line.strip().split('\t')
            if len(parts) < 2:
                continue
            code = parts[0]  # e.g. "US.CA"
            name = parts[1]  # e.g. "California"
            admin1[code] = name

    print(f"  Loaded {len(admin1)} admin1 regions")
    return admin1

def load_alternate_names(path: Path, city_ids: set) -> Dict[int, List[str]]:
    """
    Load alternate names for cities from alternateNamesV2.txt
    Only keeps names for cities in city_ids set.
    Returns: {geonameid: ['München', 'Munich', ...]}
    """
    print("Loading alternate names...")
    alt_names = defaultdict(list)
    processed = 0

    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            # Skip comment lines
            if line.startswith('#'):
                continue

            parts = line.strip().split('\t')
            if len(parts) < 4:
                continue

            # Skip lines with non-numeric geonameid (headers, etc.)
            try:
                geonameid = int(parts[1])
            except ValueError:
                continue

            iso_lang = parts[2]  # Language code
            name = parts[3]

            # Only load names for our cities
            if geonameid not in city_ids:
                continue

            # Skip very long names (likely descriptions, not names)
            if len(name) > 50:
                continue

            # Prefer official names and common languages
            # Keep: en, de, fr, es, it, pt, ru, zh, ja, ar, etc.
            # Skip: colloquial, abbreviations, airport codes
            if iso_lang in ('abbr', 'iata', 'icao', 'faac'):
                continue

            alt_names[geonameid].append(name)
            processed += 1

            if processed % 100000 == 0:
                print(f"  Processed {processed:,} alternate names")

    print(f"  Loaded {len(alt_names)} cities with {processed:,} total alternates")
    return alt_names

def load_cities(
    path: Path,
    countries: Dict[str, str],
    admin1: Dict[str, str]
) -> List[Dict]:
    """
    Load cities from cities5000.txt, filter by population, and enrich with metadata.

    Returns list of city dictionaries ready for database import.
    """
    print(f"Loading cities (min population: {MIN_POPULATION:,})...")
    cities = []

    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            parts = line.strip().split('\t')
            if len(parts) < 15:
                continue

            geonameid = int(parts[0])
            name = parts[1]
            name_ascii = parts[2] or strip_accents(name)
            lat = float(parts[4])
            lon = float(parts[5])
            country_code = parts[8]
            admin1_code = parts[10]
            population = int(parts[14]) if parts[14] else 0

            # Filter by population threshold
            if population < MIN_POPULATION:
                continue

            # Get country name
            country = countries.get(country_code, country_code)

            # Get admin1 name (state/province)
            admin1_key = f"{country_code}.{admin1_code}"
            admin1_name = admin1.get(admin1_key, None)

            # Generate flag emoji
            flag_emoji = country_code_to_flag(country_code)

            cities.append({
                'id': geonameid,
                'name': name,
                'name_ascii': name_ascii,
                'country_code': country_code,
                'country': country,
                'admin1_code': admin1_code or None,
                'admin1': admin1_name,
                'lat': lat,
                'lon': lon,
                'population': population,
                'flag_emoji': flag_emoji,
                'alt_names': [],  # Will be filled later
            })

    print(f"  Loaded {len(cities):,} cities")
    return cities

def merge_alternate_names(cities: List[Dict], alt_names: Dict[int, List[str]]) -> None:
    """Add alternate names to cities (modifies cities in-place)"""
    print("Merging alternate names...")

    for city in cities:
        geonameid = city['id']
        if geonameid in alt_names:
            # Deduplicate and limit to 20 alternates per city
            alts = list(set(alt_names[geonameid]))[:20]
            city['alt_names'] = alts

def build_search_vectors(cities: List[Dict]) -> None:
    """
    Build PostgreSQL tsvector representation for full-text search.
    This is a simplified version - actual tsvector will be built in Postgres.
    """
    print("Building search vectors...")

    for city in cities:
        # Combine all searchable text: name + alternates + country + admin1
        tokens = [city['name'], city['name_ascii'], city['country']]

        if city['admin1']:
            tokens.append(city['admin1'])

        if city['alt_names']:
            tokens.extend(city['alt_names'])

        # Join and normalize for tsvector (Postgres will do the real processing)
        city['search_text'] = ' '.join(tokens)

def upload_to_supabase(cities: List[Dict]) -> None:
    """
    Upload cities to Supabase via REST API in batches.
    Requires SUPABASE_URL and SUPABASE_SERVICE_KEY env vars.
    """
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_KEY')

    if not url or not key:
        print("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables")
        sys.exit(1)

    api_url = f"{url}/rest/v1/cities"
    headers = {
        'apikey': key,
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'  # Don't return inserted rows (faster)
    }

    print(f"\nUploading {len(cities):,} cities to Supabase in batches of {BATCH_SIZE}...")

    # Prepare cities for insert (remove search_text, add search_vector)
    for city in cities:
        # PostgreSQL will compute search_vector from alt_names array
        # We'll use a trigger or update after insert
        del city['search_text']

    # Upload in batches
    total = len(cities)
    for i in range(0, total, BATCH_SIZE):
        batch = cities[i:i+BATCH_SIZE]

        # Supabase REST API expects JSON array
        data = json.dumps(batch).encode('utf-8')

        req = urllib.request.Request(api_url, data=data, headers=headers, method='POST')

        try:
            with urllib.request.urlopen(req) as response:
                if response.status not in (200, 201, 204):
                    print(f"\nERROR: Batch {i//BATCH_SIZE + 1} failed with status {response.status}")
                    print(response.read().decode('utf-8'))
                    sys.exit(1)
        except urllib.error.HTTPError as e:
            print(f"\nHTTP ERROR: {e.code} {e.reason}")
            print(e.read().decode('utf-8'))
            sys.exit(1)

        progress = min(i + BATCH_SIZE, total)
        pct = (progress / total) * 100
        print(f"  Uploaded: {progress:,} / {total:,} ({pct:.1f}%)", end='\r')

    print(f"\n✓ Successfully uploaded {total:,} cities")

def update_search_vectors() -> None:
    """
    Update search_vector column with tsvector for all cities.
    This runs after initial import.
    """
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_KEY')

    print("\nUpdating search vectors in database...")

    # Run SQL to populate search_vector from name + alt_names
    sql = """
    UPDATE cities
    SET search_vector = to_tsvector('simple',
        name || ' ' ||
        name_ascii || ' ' ||
        COALESCE(array_to_string(alt_names, ' '), '')
    );
    """

    # Supabase doesn't have direct SQL execution via REST API,
    # so we'll need to do this via Supabase SQL Editor manually
    # or use a PostgREST RPC function

    print("  Note: Run the following SQL in Supabase SQL Editor:")
    print("  " + sql.strip())
    print("\n  Then run: ANALYZE cities;")

def main():
    """Main pipeline: download, process, and import city data"""

    print("=" * 70)
    print("GeoNames City Data Importer for Supabase")
    print("=" * 70)
    print()

    # Step 1: Download data files
    DATA_DIR.mkdir(exist_ok=True)

    files = {}
    for name, url in URLS.items():
        if url.endswith('.zip'):
            zip_path = DATA_DIR / url.split('/')[-1]
            if not zip_path.exists():
                download_file(url, zip_path)
            txt_path = DATA_DIR / (zip_path.stem.replace('V2', '') + '.txt')
            if not txt_path.exists():
                txt_path = extract_zip(zip_path)
            files[name] = txt_path
        else:
            txt_path = DATA_DIR / url.split('/')[-1]
            if not txt_path.exists():
                download_file(url, txt_path)
            files[name] = txt_path

    print()

    # Step 2: Load reference data
    countries = load_countries(files['countries'])
    admin1 = load_admin1(files['admin1'])

    # Step 3: Load cities
    cities = load_cities(files['cities'], countries, admin1)

    # Step 4: Load alternate names for our cities only
    city_ids = {city['id'] for city in cities}
    alt_names = load_alternate_names(files['alt_names'], city_ids)

    # Step 5: Merge data
    merge_alternate_names(cities, alt_names)
    build_search_vectors(cities)

    # Step 6: Upload to Supabase
    upload_to_supabase(cities)

    # Step 7: Instructions for finalizing
    update_search_vectors()

    print()
    print("=" * 70)
    print("✓ Import complete!")
    print("=" * 70)
    print()
    print("Next steps:")
    print("1. Run the UPDATE query shown above in Supabase SQL Editor")
    print("2. Run: ANALYZE cities;")
    print("3. Test autocomplete: SELECT * FROM city_autocomplete('paris');")
    print()
    print("Don't forget to add GeoNames attribution to your site!")
    print("  City data from https://www.geonames.org/ (CC BY 4.0)")
    print()

if __name__ == '__main__':
    main()
