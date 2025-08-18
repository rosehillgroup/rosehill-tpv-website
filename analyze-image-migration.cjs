const fs = require('fs');
const path = require('path');

function analyzeImageMigration() {
  console.log('🔍 Analyzing image migration requirements...\n');
  
  // Load the exported data
  const backupData = JSON.parse(fs.readFileSync('installations-backup.json', 'utf8'));
  const installations = backupData.installations;
  
  // Categorize images
  const imageAnalysis = {
    alreadyInSupabase: [],
    needsMigration: [],
    missing: [],
    noImages: []
  };
  
  const localImageReferences = new Set();
  
  installations.forEach(inst => {
    if (!inst.images || inst.images.length === 0) {
      imageAnalysis.noImages.push({
        slug: inst.slug,
        title: inst.title
      });
      return;
    }
    
    const imageStatus = {
      slug: inst.slug,
      title: inst.title,
      images: []
    };
    
    inst.images.forEach(img => {
      if (typeof img === 'object' && img.url && img.url.includes('supabase.co')) {
        // Already in Supabase
        imageStatus.images.push({
          filename: img.filename,
          status: 'supabase',
          url: img.url
        });
      } else {
        // Local reference - needs migration
        const filename = typeof img === 'string' ? img : img.filename;
        localImageReferences.add(filename);
        
        // Check if file exists locally
        const possiblePaths = [
          `images/installations/${filename}`,
          `images/${filename}`,
          filename
        ];
        
        let exists = false;
        let foundPath = null;
        for (const checkPath of possiblePaths) {
          if (fs.existsSync(checkPath)) {
            exists = true;
            foundPath = checkPath;
            break;
          }
        }
        
        imageStatus.images.push({
          filename: filename,
          status: exists ? 'local' : 'missing',
          path: foundPath
        });
      }
    });
    
    // Categorize the installation based on its images
    const hasSupabase = imageStatus.images.some(img => img.status === 'supabase');
    const hasLocal = imageStatus.images.some(img => img.status === 'local');
    const hasMissing = imageStatus.images.some(img => img.status === 'missing');
    
    if (hasSupabase && !hasLocal && !hasMissing) {
      imageAnalysis.alreadyInSupabase.push(imageStatus);
    } else if (hasLocal || hasMissing) {
      imageAnalysis.needsMigration.push(imageStatus);
    }
  });
  
  console.log('📊 Image Analysis Summary:');
  console.log(`Total installations: ${installations.length}`);
  console.log(`Already in Supabase: ${imageAnalysis.alreadyInSupabase.length}`);
  console.log(`Need migration: ${imageAnalysis.needsMigration.length}`);
  console.log(`No images: ${imageAnalysis.noImages.length}\n`);
  
  // Analyze local image files
  console.log('🗂️  Local Image Analysis:');
  console.log(`Unique local image references: ${localImageReferences.size}`);
  
  const localImageStats = {
    found: 0,
    missing: 0,
    missingFiles: []
  };
  
  localImageReferences.forEach(filename => {
    const possiblePaths = [
      `images/installations/${filename}`,
      `images/${filename}`,
      filename
    ];
    
    let found = false;
    for (const checkPath of possiblePaths) {
      if (fs.existsSync(checkPath)) {
        found = true;
        break;
      }
    }
    
    if (found) {
      localImageStats.found++;
    } else {
      localImageStats.missing++;
      localImageStats.missingFiles.push(filename);
    }
  });
  
  console.log(`Local images found: ${localImageStats.found}`);
  console.log(`Local images missing: ${localImageStats.missing}`);
  
  if (localImageStats.missing > 0) {
    console.log(`\\nMissing files (first 10):`)
    localImageStats.missingFiles.slice(0, 10).forEach(file => {
      console.log(`  - ${file}`);
    });
    if (localImageStats.missingFiles.length > 10) {
      console.log(`  ... and ${localImageStats.missingFiles.length - 10} more`);
    }
  }
  
  // Save detailed analysis
  const analysis = {
    summary: {
      totalInstallations: installations.length,
      alreadyInSupabase: imageAnalysis.alreadyInSupabase.length,
      needsMigration: imageAnalysis.needsMigration.length,
      noImages: imageAnalysis.noImages.length,
      localImagesFound: localImageStats.found,
      localImagesMissing: localImageStats.missing
    },
    imageAnalysis,
    localImageStats,
    migrationPlan: {
      strategy: 'Upload found local images to Supabase storage, skip missing files',
      filesToUpload: localImageStats.found,
      filesToSkip: localImageStats.missing
    }
  };
  
  fs.writeFileSync('image-migration-analysis.json', JSON.stringify(analysis, null, 2));
  console.log(`\\n✓ Analysis saved to image-migration-analysis.json`);
  
  // Recommendations
  console.log(`\\n💡 Migration Plan:`);
  console.log(`1. Upload ${localImageStats.found} found local images to Supabase storage`);
  console.log(`2. Update ${imageAnalysis.needsMigration.length} installations with new Supabase URLs`);
  if (localImageStats.missing > 0) {
    console.log(`3. ⚠️  ${localImageStats.missing} images are missing and will be skipped`);
  }
  console.log(`4. ${imageAnalysis.alreadyInSupabase.length} installations already have proper Supabase URLs`);
  
  return analysis;
}

analyzeImageMigration();