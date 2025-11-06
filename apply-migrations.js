// Apply Supabase migrations via REST API
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://okakomwfikxmwllvliva.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rYWtvbXdmaWt4bXdsbHZsaXZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI2NzAzMywiZXhwIjoyMDczODQzMDMzfQ.fuBpUu89pbpYh2HuY1ZEKHa7VCqmFG-a106PuAacKNY';

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runMigration(filePath) {
  console.log(`\nApplying migration: ${filePath}`);
  const sql = readFileSync(filePath, 'utf8');

  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('Migration failed:', error);
    return false;
  }

  console.log('✅ Migration applied successfully');
  return true;
}

// Apply migrations
(async () => {
  console.log('Applying studio_jobs migrations...\n');

  const migrations = [
    'supabase/migrations/007_create_studio_jobs_table.sql',
    'supabase/migrations/008_webhook_pattern_schema.sql'
  ];

  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (!success) {
      console.error(`\nFailed to apply ${migration}`);
      process.exit(1);
    }
  }

  console.log('\n✅ All migrations applied successfully!');
})();
