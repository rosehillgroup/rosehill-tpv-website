// Debug installation data structure
async function main() {
  const sanityClient = await import('@sanity/client');
  const sanity = sanityClient.createClient({
    projectId: '68ola3dd',
    dataset: 'production', 
    apiVersion: '2023-05-03',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false
  });

  const query = `*[_type == "installation"] | order(_createdAt desc) [0...5] {
    _id,
    title,
    slug,
    installationDate,
    overview,
    location,
    coverImage,
    _createdAt
  }`;

  const installations = await sanity.fetch(query);
  console.log('Recent installations:');
  installations.forEach((inst, i) => {
    console.log(`${i + 1}. Title: ${typeof inst.title} - "${inst.title}"`);
    console.log(`   Slug: ${JSON.stringify(inst.slug)}`);
    console.log(`   Location: ${JSON.stringify(inst.location)}`);
    console.log(`   Overview type: ${typeof inst.overview}, length: ${inst.overview?.length}`);
    console.log(`   Cover image: ${inst.coverImage ? 'exists' : 'missing'}`);
    console.log(`   Created: ${inst._createdAt}`);
    console.log('');
  });
}

main().catch(console.error);