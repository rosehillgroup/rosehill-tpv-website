// Apply tpv-visualiser storage bucket migration to Supabase
// Run with: node scripts/apply-storage-migration.js

const fs = require('fs');
const path = require('path');

// Read migration SQL
const migrationSQL = fs.readFileSync(
  path.join(__dirname, '../supabase/migrations/006_create_tpv_visualiser_bucket.sql'),
  'utf8'
);

// Supabase connection details
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://okakomwfikxmwllvliva.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_KEY environment variable not set');
  process.exit(1);
}

// Use node-fetch for HTTP requests
async function executeMigration() {
  try {
    console.log('Applying migration to Supabase...');
    console.log('URL:', SUPABASE_URL);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({
        query: migrationSQL
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();
    console.log('Migration applied successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));

    // Verify bucket was created
    console.log('\nVerifying bucket creation...');
    const bucketsResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    });

    const buckets = await bucketsResponse.json();
    const visualiserBucket = buckets.find(b => b.name === 'tpv-visualiser');

    if (visualiserBucket) {
      console.log('✓ tpv-visualiser bucket found:', JSON.stringify(visualiserBucket, null, 2));
    } else {
      console.log('⚠ tpv-visualiser bucket not found in bucket list');
      console.log('Available buckets:', buckets.map(b => b.name).join(', '));
    }

  } catch (error) {
    console.error('ERROR applying migration:', error.message);
    process.exit(1);
  }
}

executeMigration();
