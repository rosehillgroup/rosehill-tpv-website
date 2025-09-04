// Delete ALL installations from Sanity to start fresh
async function main() {
  const sanityClient = await import('@sanity/client');
  const sanity = sanityClient.createClient({
    projectId: '68ola3dd',
    dataset: 'production',
    apiVersion: '2023-05-03',
    token: process.env.SANITY_WRITE_TOKEN, // This needs Admin permissions for delete
    useCdn: false
  });

  console.log('🔍 Fetching all installations...');
  const installations = await sanity.fetch(`*[_type == "installation"] { _id, title }`);
  
  console.log(`📊 Found ${installations.length} installations to delete`);
  
  if (installations.length === 0) {
    console.log('✅ No installations found - Sanity is already clean');
    return;
  }

  console.log('🗑️  Deleting all installations...');
  
  try {
    // Delete all installations in one transaction
    const deleteIds = installations.map(inst => inst._id);
    await sanity.delete(deleteIds);
    
    console.log('✅ Successfully deleted all installations');
    console.log('🎉 Sanity installations dataset is now clean');
    
  } catch (error) {
    console.error('❌ Delete failed:', error.message);
    
    if (error.message.includes('Insufficient permissions')) {
      console.log('\n💡 Your SANITY_WRITE_TOKEN needs Admin or Maintainer permissions to delete documents.');
      console.log('   Go to your Sanity project dashboard → API → Tokens');
      console.log('   Create a new token with Admin role or update existing token permissions.');
    }
    
    return;
  }

  // Verify deletion
  const remaining = await sanity.fetch(`count(*[_type == "installation"])`);
  console.log(`📈 Remaining installations: ${remaining}`);
}

main().catch(console.error);