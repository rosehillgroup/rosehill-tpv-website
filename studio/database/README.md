# Database Migrations

This folder contains SQL migrations for the TPV Studio Supabase database.

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of the migration file (e.g., `migrations/001_add_recraft_fields.sql`)
4. Paste into the SQL editor
5. Click **Run** to execute

### Option 2: Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run specific migration
supabase db execute --file database/migrations/001_add_recraft_fields.sql

# Or run all pending migrations
supabase db push
```

### Option 3: Direct psql Connection

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run migration
\i database/migrations/001_add_recraft_fields.sql
```

## Migration History

| ID | File | Description | Date |
|----|------|-------------|------|
| 001 | `001_add_recraft_fields.sql` | Add Recraft vector AI fields to studio_jobs | 2025-01-13 |

## Rollback Instructions

If you need to rollback a migration, create a corresponding rollback script:

### Rollback for 001_add_recraft_fields.sql

```sql
-- Remove Recraft-specific columns
ALTER TABLE studio_jobs
DROP COLUMN IF EXISTS mode_type,
DROP COLUMN IF EXISTS attempt_current,
DROP COLUMN IF EXISTS attempt_max,
DROP COLUMN IF EXISTS validation_history,
DROP COLUMN IF EXISTS compliant,
DROP COLUMN IF EXISTS all_attempt_urls,
DROP COLUMN IF EXISTS inspector_final_reasons,
DROP COLUMN IF EXISTS max_colours;

-- Drop indexes
DROP INDEX IF EXISTS idx_studio_jobs_mode_type;
DROP INDEX IF EXISTS idx_studio_jobs_compliant;

-- Drop constraint
ALTER TABLE studio_jobs
DROP CONSTRAINT IF EXISTS check_attempt_current_valid;
```

## Testing Migrations

Before running in production:

1. Test on a staging/development Supabase project first
2. Backup your production database
3. Check for any dependent queries or code that might break
4. Verify indexes are created successfully
5. Test with sample data

## Notes

- All migrations should be **idempotent** (safe to run multiple times)
- Use `IF EXISTS` / `IF NOT EXISTS` clauses
- Add comments to document column purposes
- Create indexes for frequently queried columns
- Consider adding constraints for data integrity
