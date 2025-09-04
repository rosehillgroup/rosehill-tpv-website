// Clean up legacy installations that don't have proper cover images or structure
async function main() {
  const { createClient } = await import('@sanity/client');
  
  const sanity = createClient({
    projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2023-05-03',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false
  });

  console.log('Fetching all installations...');
  
  // Get all installations with cover image info
  const query = `*[_type == "installation"] {
    _id,
    title,
    "slug": slug.current,
    "hasCoverImage": defined(coverImage.asset._ref),
    "coverImageRef": coverImage.asset._ref,
    installationDate,
    _createdAt
  }`;

  const installations = await sanity.fetch(query);
  console.log(`Found ${installations.length} total installations`);

  // Filter installations without proper cover images
  const toDelete = installations.filter(inst => 
    !inst.hasCoverImage || 
    !inst.title || 
    inst.title === '[object Object]' ||
    typeof inst.title !== 'string'
  );

  const toKeep = installations.filter(inst => 
    inst.hasCoverImage && 
    inst.title && 
    inst.title !== '[object Object]' &&
    typeof inst.title === 'string'
  );

  console.log(`\nFound ${toDelete.length} legacy installations to delete`);
  console.log(`Found ${toKeep.length} valid installations to keep`);

  if (toDelete.length > 0) {
    console.log('\nLegacy installations to be deleted:');
    toDelete.forEach(inst => {
      console.log(`- ${inst._id}: "${inst.title || 'NO TITLE'}" (${inst.installationDate || 'NO DATE'})`);
    });

    console.log('\nDeleting legacy installations...');
    
    // Delete in batches of 10 to avoid overwhelming the API
    const batchSize = 10;
    for (let i = 0; i < toDelete.length; i += batchSize) {
      const batch = toDelete.slice(i, i + batchSize);
      const deleteIds = batch.map(inst => inst._id);
      
      console.log(`Deleting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(toDelete.length/batchSize)}...`);
      
      try {
        await sanity.delete(deleteIds);
        console.log(`✓ Deleted ${deleteIds.length} installations`);
      } catch (error) {
        console.error(`✗ Failed to delete batch:`, error.message);
      }
    }
  }

  console.log(`\n🎉 Cleanup complete!`);
  console.log(`📊 Remaining installations: ${toKeep.length}`);
  
  if (toKeep.length > 0) {
    console.log('\nRemaining valid installations:');
    toKeep.forEach(inst => {
      console.log(`- "${inst.title}" (${inst.installationDate})`);
    });
  }
}

main().catch(console.error);