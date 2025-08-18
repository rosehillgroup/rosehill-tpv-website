const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function updateSupabaseInstallations() {
  console.log('🔄 Updating Supabase installations with new structure...\n');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  // Load migration results and URL standardization plan
  const migrationResults = JSON.parse(fs.readFileSync('image-migration-results.json', 'utf8'));
  const urlPlan = JSON.parse(fs.readFileSync('url-standardization-plan.json', 'utf8'));
  const backupData = JSON.parse(fs.readFileSync('installations-backup.json', 'utf8'));
  
  console.log('📋 Update Plan:');
  console.log(`- Update ${migrationResults.successful.length} installations with new image URLs`);
  console.log(`- Remove timestamps from ${urlPlan.safeChanges.length} installation slugs`);
  console.log(`- Total installations to update: ${backupData.installations.length}\n`);
  
  const updateResults = {
    successful: [],
    failed: [],
    skipped: []
  };
  
  // Create lookup maps for efficiency
  const imageUpdates = new Map();
  migrationResults.successful.forEach(result => {
    imageUpdates.set(result.slug, result.updatedImages);
  });
  
  const slugUpdates = new Map();
  urlPlan.safeChanges.forEach(change => {
    slugUpdates.set(change.current, change.proposed);
  });
  
  // Process each installation
  for (const installation of backupData.installations) {
    const originalSlug = installation.slug;
    let updateData = {};
    let hasChanges = false;
    
    console.log(`📝 Processing: ${installation.title}`);
    
    // 1. Update slug if needed (remove timestamp)
    if (slugUpdates.has(originalSlug)) {
      const newSlug = slugUpdates.get(originalSlug);
      updateData.slug = newSlug;
      hasChanges = true;
      console.log(`  🏷️  Slug: ${originalSlug} → ${newSlug}`);
    }
    
    // 2. Update images if needed
    if (imageUpdates.has(originalSlug)) {
      const newImages = imageUpdates.get(originalSlug);
      updateData.images = newImages;
      hasChanges = true;
      console.log(`  🖼️  Updated ${newImages.length} image URLs`);
    }
    
    if (!hasChanges) {
      console.log(`  ✓ No changes needed`);
      updateResults.skipped.push({
        id: installation.id,
        slug: originalSlug,
        reason: 'No changes needed'
      });
      continue;
    }
    
    // Update the record in Supabase
    try {
      const { error } = await supabase
        .from('installations')
        .update(updateData)
        .eq('id', installation.id);
      
      if (error) {
        console.error(`  ❌ Failed to update: ${error.message}`);
        updateResults.failed.push({
          id: installation.id,
          slug: originalSlug,
          error: error.message,
          updateData: updateData
        });
      } else {
        console.log(`  ✅ Successfully updated`);
        updateResults.successful.push({
          id: installation.id,
          originalSlug: originalSlug,
          newSlug: updateData.slug || originalSlug,
          changes: Object.keys(updateData)
        });
      }
    } catch (updateError) {
      console.error(`  ❌ Update error: ${updateError.message}`);
      updateResults.failed.push({
        id: installation.id,
        slug: originalSlug,
        error: updateError.message,
        updateData: updateData
      });
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log('📊 Update Summary:');
  console.log(`- Successfully updated: ${updateResults.successful.length}`);
  console.log(`- Failed updates: ${updateResults.failed.length}`);
  console.log(`- Skipped (no changes): ${updateResults.skipped.length}`);
  
  // Save results
  fs.writeFileSync('supabase-update-results.json', JSON.stringify(updateResults, null, 2));
  console.log(`\n✓ Update results saved to supabase-update-results.json`);
  
  if (updateResults.failed.length > 0) {
    console.log(`\n⚠️  Failed updates:`);
    updateResults.failed.forEach(fail => {
      console.log(`  - ${fail.slug}: ${fail.error}`);
    });
  }
  
  console.log(`\n💡 Summary of changes applied:`);
  console.log(`- Image URLs migrated to Supabase storage: ${migrationResults.successful.length} installations`);
  console.log(`- Slugs standardized (timestamps removed): ${urlPlan.safeChanges.length} installations`);
  console.log(`- Database records updated: ${updateResults.successful.length} installations`);
  
  return updateResults;
}

updateSupabaseInstallations().catch(console.error);