#!/usr/bin/env python3
"""
Create tpv-visualiser storage bucket in Supabase
Run with: python3 scripts/create-visualiser-bucket.py
"""

import os
import sys
from supabase import create_client, Client

# Get Supabase credentials from environment
SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://okakomwfikxmwllvliva.supabase.co')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')

if not SUPABASE_SERVICE_KEY:
    print('ERROR: SUPABASE_SERVICE_KEY environment variable not set')
    sys.exit(1)

print(f'Connecting to Supabase at {SUPABASE_URL}...')

# Initialize Supabase client with service role key
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

try:
    # Check if bucket already exists
    print('\nChecking existing buckets...')
    buckets = supabase.storage.list_buckets()
    existing = next((b for b in buckets if b['name'] == 'tpv-visualiser'), None)

    if existing:
        print(f'✓ Bucket "tpv-visualiser" already exists: {existing}')
    else:
        # Create the bucket
        print('\nCreating bucket "tpv-visualiser"...')
        result = supabase.storage.create_bucket(
            'tpv-visualiser',
            options={
                'public': False,  # Private bucket
                'file_size_limit': 12582912,  # 12MB
                'allowed_mime_types': ['image/jpeg', 'image/png', 'image/webp']
            }
        )
        print(f'✓ Bucket created successfully: {result}')

    # Now apply RLS policies via SQL
    print('\nApplying RLS policies...')

    # Read the migration SQL
    import pathlib
    migration_file = pathlib.Path(__file__).parent.parent / 'supabase' / 'migrations' / '006_create_tpv_visualiser_bucket.sql'

    with open(migration_file, 'r') as f:
        sql = f.read()

    # Extract only the policy and function creation parts (skip bucket creation)
    sql_parts = sql.split('INSERT INTO storage.buckets', 1)
    if len(sql_parts) > 1:
        # Skip the INSERT and get everything after
        remaining_sql = sql_parts[1].split('-- Enable RLS', 1)
        if len(remaining_sql) > 1:
            policies_sql = '-- Enable RLS' + remaining_sql[1]

            # Execute the RLS policies
            print('Executing RLS policies and cleanup function...')
            supabase.postgrest.rpc('exec_sql', {'query': policies_sql}).execute()
            print('✓ RLS policies applied')

    print('\n✓ tpv-visualiser bucket setup complete!')

    # Verify the bucket
    print('\nVerifying bucket configuration...')
    buckets = supabase.storage.list_buckets()
    visualiser = next((b for b in buckets if b['name'] == 'tpv-visualiser'), None)

    if visualiser:
        print(f'✓ Bucket found:')
        print(f'  Name: {visualiser.get("name")}')
        print(f'  Public: {visualiser.get("public")}')
        print(f'  File size limit: {visualiser.get("file_size_limit", "N/A")} bytes')
        print(f'  Allowed MIME types: {visualiser.get("allowed_mime_types", "N/A")}')
    else:
        print('⚠ Warning: Bucket not found in list')

except Exception as e:
    print(f'\nERROR: {type(e).__name__}: {str(e)}')
    sys.exit(1)
