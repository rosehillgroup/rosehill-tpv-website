const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
// Note: You'll need to set these environment variables or replace with actual values
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'your-supabase-service-role-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Function to migrate installations
async function migrateInstallations() {
    try {
        // Read the JSON file
        const jsonData = JSON.parse(fs.readFileSync('installations.json', 'utf8'));
        const installations = jsonData.installations;

        console.log(`Found ${installations.length} installations to migrate...`);

        for (let i = 0; i < installations.length; i++) {
            const installation = installations[i];
            console.log(`\nMigrating ${i + 1}/${installations.length}: ${installation.title}`);

            // Create slug
            const slug = createSlug(installation.title);

            // Prepare installation data for Supabase
            const installationData = {
                title: installation.title,
                location: installation.location,
                installation_date: installation.date,
                application: installation.application,
                description: installation.description, // Array of paragraphs
                slug: slug,
                images: installation.images.map(img => ({
                    filename: img,
                    url: null // Will be null for existing local images
                }))
            };

            // Insert into Supabase
            const { data, error } = await supabase
                .from('installations')
                .insert(installationData)
                .select()
                .single();

            if (error) {
                console.error(`Error inserting ${installation.title}:`, error);
            } else {
                console.log(`✓ Successfully migrated: ${installation.title}`);
            }

            // Small delay to avoid overwhelming the database
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('\n✅ Migration completed!');

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

// Run the migration
if (require.main === module) {
    migrateInstallations();
}

module.exports = { migrateInstallations };