const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function migrateImagesToSupabase() {
  console.log('📤 Starting image migration to Supabase storage...\n');
  
  // Check for service role key (needed for storage uploads)
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required for uploading images');
    console.log('💡 Please set the service role key to proceed with image migration');
    console.log('   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
    return;
  }
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  // Load analysis data
  const analysis = JSON.parse(fs.readFileSync('image-migration-analysis.json', 'utf8'));
  const installationsNeedingMigration = analysis.imageAnalysis.needsMigration;
  
  console.log(`🎯 Migration Plan:`);
  console.log(`- ${installationsNeedingMigration.length} installations need image migration`);
  console.log(`- ${analysis.summary.localImagesFound} local images to upload\n`);
  
  const migrationResults = {
    successful: [],
    failed: [],
    skipped: []
  };
  
  let totalUploaded = 0;
  
  // Process each installation that needs migration
  for (const installation of installationsNeedingMigration) {
    console.log(`📁 Processing: ${installation.title}`);
    
    const updatedImages = [];
    
    for (const img of installation.images) {
      if (img.status === 'supabase') {
        // Already in Supabase, keep as-is
        updatedImages.push({
          url: img.url,
          filename: img.filename,
          path: `installations/${img.filename}`
        });
        console.log(`  ✓ ${img.filename} (already in Supabase)`);
      } else if (img.status === 'local' && img.path) {
        // Need to upload to Supabase
        try {
          const fileBuffer = fs.readFileSync(img.path);
          const fileName = img.filename;
          const storagePath = `installations/${fileName}`;
          
          // Upload to Supabase storage
          const { data, error } = await supabase.storage
            .from('installation-images')
            .upload(storagePath, fileBuffer, {
              cacheControl: '3600',
              upsert: true
            });
          
          if (error) {
            if (error.message.includes('already exists')) {
              // File already exists, get the public URL
              const { data: publicUrl } = supabase.storage
                .from('installation-images')
                .getPublicUrl(storagePath);
              
              updatedImages.push({
                url: publicUrl.publicUrl,
                filename: fileName,
                path: storagePath
              });
              console.log(`  ✓ ${fileName} (already exists)`);
            } else {
              console.error(`  ❌ ${fileName}: ${error.message}`);
              migrationResults.failed.push({
                installation: installation.slug,
                filename: fileName,
                error: error.message
              });
              continue;
            }
          } else {
            // Successfully uploaded, get public URL
            const { data: publicUrl } = supabase.storage
              .from('installation-images')
              .getPublicUrl(storagePath);
            
            updatedImages.push({
              url: publicUrl.publicUrl,
              filename: fileName,
              path: storagePath
            });
            console.log(`  ✅ ${fileName} (uploaded)`);
            totalUploaded++;
          }
        } catch (uploadError) {
          console.error(`  ❌ ${img.filename}: ${uploadError.message}`);
          migrationResults.failed.push({
            installation: installation.slug,
            filename: img.filename,
            error: uploadError.message
          });
        }
      } else {
        // Missing file, skip
        console.log(`  ⚠️  ${img.filename} (missing file, skipped)`);
        migrationResults.skipped.push({
          installation: installation.slug,
          filename: img.filename
        });
      }
    }
    
    // Store the updated image references for this installation
    migrationResults.successful.push({
      slug: installation.slug,
      title: installation.title,
      originalImages: installation.images,
      updatedImages: updatedImages
    });
    
    console.log(`  ✓ Completed ${installation.title}\n`);
  }
  
  console.log(`📊 Migration Summary:`);
  console.log(`- Successfully processed: ${migrationResults.successful.length} installations`);
  console.log(`- Total images uploaded: ${totalUploaded}`);
  console.log(`- Failed uploads: ${migrationResults.failed.length}`);
  console.log(`- Skipped files: ${migrationResults.skipped.length}`);
  
  // Save migration results
  fs.writeFileSync('image-migration-results.json', JSON.stringify(migrationResults, null, 2));
  console.log(`\n✓ Migration results saved to image-migration-results.json`);
  
  if (migrationResults.failed.length > 0) {
    console.log(`\n⚠️  Failed uploads:`);
    migrationResults.failed.forEach(fail => {
      console.log(`  - ${fail.installation}: ${fail.filename} (${fail.error})`);
    });
  }
  
  console.log(`\n💡 Next steps:`);
  console.log(`1. Review migration results`);
  console.log(`2. Update installation records in Supabase with new image URLs`);
  console.log(`3. Regenerate installation pages`);
  
  return migrationResults;
}

// Only run if service role key is available
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  migrateImagesToSupabase().catch(console.error);
} else {
  console.log('🔑 Image migration requires SUPABASE_SERVICE_ROLE_KEY');
  console.log('Set the environment variable and run again:');
  console.log('SUPABASE_SERVICE_ROLE_KEY="your-key" node migrate-images-to-supabase.cjs');
}