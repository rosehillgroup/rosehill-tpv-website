# TPV Design Visualiser - Supabase Setup

## Storage Bucket Status

✅ **Bucket Created**: `tpv-visualiser` bucket has been created via API

**Configuration**:
- Name: `tpv-visualiser`
- Privacy: Private (accessed via signed URLs)
- File size limit: 12MB (12,582,912 bytes)
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

## Manual Setup Required

### RLS Policies (via Supabase Dashboard)

The following RLS policies need to be applied manually via the Supabase Dashboard SQL Editor:

1. Go to: https://supabase.com/dashboard/project/okakomwfikxmwllvliva/sql/new
2. Run the SQL from: `supabase/migrations/006_create_tpv_visualiser_bucket.sql`
3. Focus on these sections:
   - RLS policies for authenticated @rosehill.group users
   - Service role bypass policy
   - Cleanup function for files older than 24 hours

**Key Policies**:
- INSERT: Allow @rosehill.group users to upload
- SELECT: Allow @rosehill.group users to read
- UPDATE: Allow @rosehill.group users to update
- DELETE: Allow @rosehill.group users to delete
- ALL: Service role has full access for cleanup

### Cleanup Schedule (Optional)

To enable automatic cleanup of files older than 24 hours:

1. Enable `pg_cron` extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_cron;
   ```

2. Schedule the cleanup function:
   ```sql
   SELECT cron.schedule('cleanup-visualiser-files', '0 2 * * *', 'SELECT cleanup_old_visualiser_files()');
   ```

Or run cleanup manually:
```sql
SELECT cleanup_old_visualiser_files();
```

## Usage

### Generating Signed URLs

```javascript
const { data, error } = await supabase.storage
  .from('tpv-visualiser')
  .createSignedUrl('path/to/file.jpg', 60); // 60 seconds expiry
```

### Uploading Files

```javascript
const { data, error } = await supabase.storage
  .from('tpv-visualiser')
  .upload('uploads/photo.jpg', file, {
    cacheControl: '3600',
    upsert: false
  });
```

## Files Created

- `supabase/migrations/006_create_tpv_visualiser_bucket.sql` - Complete migration SQL
- `scripts/create-visualiser-bucket.py` - Python script for bucket creation (requires supabase-py)
- `scripts/apply-storage-migration.js` - Node.js script for migration (alternative)
