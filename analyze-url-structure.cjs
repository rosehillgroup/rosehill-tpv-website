const fs = require('fs');

function analyzeUrlStructure() {
  console.log('🔍 Analyzing URL structure and proposing standardization...\n');
  
  // Load the exported data
  const data = JSON.parse(fs.readFileSync('installations-analysis.json', 'utf8'));
  const timestamped = data.timestampedInstallations;
  const nonTimestamped = data.nonTimestampedInstallations;
  
  console.log(`📊 Current State:`);
  console.log(`- Timestamped installations: ${timestamped.length}`);
  console.log(`- Non-timestamped installations: ${nonTimestamped.length}\n`);
  
  // Analyze what would happen if we remove timestamps
  console.log('🎯 Standardization Plan: Remove timestamps from all URLs\n');
  
  const proposedChanges = [];
  const conflicts = [];
  const existingSlugs = new Set(nonTimestamped.map(inst => inst.slug));
  
  timestamped.forEach(inst => {
    // Remove timestamp from slug (last hyphen + 13 digits)
    const currentSlug = inst.slug;
    const proposedSlug = currentSlug.replace(/-\d{13}$/, '');
    
    if (existingSlugs.has(proposedSlug)) {
      conflicts.push({
        current: currentSlug,
        proposed: proposedSlug,
        title: inst.title,
        issue: 'Slug conflict with existing installation'
      });
    } else {
      proposedChanges.push({
        current: currentSlug,
        proposed: proposedSlug,
        title: inst.title,
        id: inst.id
      });
      existingSlugs.add(proposedSlug); // Track for subsequent conflicts
    }
  });
  
  console.log(`✅ Safe changes (${proposedChanges.length}):`);
  proposedChanges.forEach(change => {
    console.log(`  ${change.current} → ${change.proposed}`);
  });
  
  if (conflicts.length > 0) {
    console.log(`\\n⚠️  Conflicts requiring manual resolution (${conflicts.length}):`);
    conflicts.forEach(conflict => {
      console.log(`  ${conflict.current} → ${conflict.proposed} (CONFLICT)`);
      console.log(`    Title: ${conflict.title}`);
    });
  }
  
  // Check for any duplicate slugs in non-timestamped 
  const slugCounts = {};
  nonTimestamped.forEach(inst => {
    slugCounts[inst.slug] = (slugCounts[inst.slug] || 0) + 1;
  });
  
  const duplicates = Object.entries(slugCounts).filter(([slug, count]) => count > 1);
  if (duplicates.length > 0) {
    console.log(`\\n🚨 Existing duplicate slugs in non-timestamped installations:`);
    duplicates.forEach(([slug, count]) => {
      console.log(`  ${slug} (appears ${count} times)`);
    });
  }
  
  // Save the standardization plan
  const plan = {
    strategy: 'Remove timestamps to standardize on non-timestamped format',
    safeChanges: proposedChanges,
    conflicts: conflicts,
    existingDuplicates: duplicates,
    summary: {
      totalTimestamped: timestamped.length,
      safeToChange: proposedChanges.length,
      needsResolution: conflicts.length,
      existingDuplicates: duplicates.length
    }
  };
  
  fs.writeFileSync('url-standardization-plan.json', JSON.stringify(plan, null, 2));
  console.log(`\\n✓ Standardization plan saved to url-standardization-plan.json`);
  
  // Recommendations
  console.log(`\\n💡 Recommendations:`);
  if (conflicts.length === 0 && duplicates.length === 0) {
    console.log('✅ All URLs can be safely standardized by removing timestamps');
  } else {
    if (conflicts.length > 0) {
      console.log(`⚠️  ${conflicts.length} conflicts need manual resolution (suggest adding suffixes)`);
    }
    if (duplicates.length > 0) {
      console.log(`🚨 ${duplicates.length} existing duplicates need to be fixed first`);
    }
  }
  
  return plan;
}

analyzeUrlStructure();