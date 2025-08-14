const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing required environment variables:');
    console.error('SUPABASE_URL:', !!supabaseUrl);
    console.error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY:', !!supabaseKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Load customer URL mappings
function loadCustomerUrls() {
    try {
        const customerUrlsPath = path.join(__dirname, 'customer-urls.json');
        const customerUrlsData = fs.readFileSync(customerUrlsPath, 'utf8');
        return JSON.parse(customerUrlsData);
    } catch (error) {
        console.error('Could not load customer URLs:', error.message);
        process.exit(1);
    }
}

/**
 * Convert customer company names to hyperlinks in text
 * @param {string} text - Text that may contain customer company names
 * @param {Object} customerUrls - Mapping of company names to URLs
 * @returns {string} - Text with customer names converted to links
 */
function linkCustomerNames(text, customerUrls) {
    if (!text || typeof text !== 'string') return text;
    
    let linkedText = text;
    
    // Sort company names by length (longest first) to avoid partial matches
    const sortedCompanyNames = Object.keys(customerUrls).sort((a, b) => b.length - a.length);
    
    for (const companyName of sortedCompanyNames) {
        const url = customerUrls[companyName];
        if (!url) continue;
        
        // Create regex for case-insensitive matching, accounting for HTML entities
        const escapedCompanyName = companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Match the company name, handling both & and &amp; versions
        const regex = new RegExp(`\\b${escapedCompanyName.replace(/&/g, '(&amp;|&)')}\\b`, 'gi');
        
        // Replace with linked version (no styling in database - that's handled in display)
        linkedText = linkedText.replace(regex, (match) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${match}</a>`;
        });
    }
    
    return linkedText;
}

/**
 * Update installation descriptions with customer links in Supabase database
 */
async function updateCustomerLinksInDatabase() {
    try {
        console.log('Loading customer URL mappings...');
        const customerUrls = loadCustomerUrls();
        console.log(`Loaded ${Object.keys(customerUrls).length} customer URL mappings`);
        
        console.log('Fetching all installations from Supabase...');
        
        // Get all installations from Supabase
        const { data: installations, error } = await supabase
            .from('installations')
            .select('id, title, description');

        if (error) {
            throw new Error(`Failed to fetch installations: ${error.message}`);
        }

        console.log(`Found ${installations.length} installations in database`);
        
        let updatedCount = 0;
        let skippedCount = 0;
        
        // Process each installation
        for (const installation of installations) {
            const { id, title, description } = installation;
            
            // Check if this installation has "thanks" mentions
            const descriptionText = Array.isArray(description) 
                ? description.join(' ')
                : description;
            
            const hasThanks = /thanks to/i.test(descriptionText);
            
            if (!hasThanks) {
                console.log(`⏭️  Skipping "${title}" - no thanks mentions`);
                skippedCount++;
                continue;
            }
            
            // Apply customer linking to descriptions
            let updatedDescription;
            let hasChanges = false;
            
            if (Array.isArray(description)) {
                updatedDescription = description.map(paragraph => {
                    const linkedParagraph = linkCustomerNames(paragraph, customerUrls);
                    if (linkedParagraph !== paragraph) {
                        hasChanges = true;
                    }
                    return linkedParagraph;
                });
            } else {
                updatedDescription = linkCustomerNames(description, customerUrls);
                hasChanges = updatedDescription !== description;
            }
            
            // Only update if there are actual changes
            if (!hasChanges) {
                console.log(`⏭️  Skipping "${title}" - no customer matches found`);
                skippedCount++;
                continue;
            }
            
            console.log(`🔗 Updating "${title}" with customer links...`);
            
            // Update the installation in Supabase
            const { error: updateError } = await supabase
                .from('installations')
                .update({ description: updatedDescription })
                .eq('id', id);
            
            if (updateError) {
                console.error(`❌ Failed to update "${title}":`, updateError.message);
            } else {
                console.log(`✅ Updated "${title}"`);
                updatedCount++;
            }
        }
        
        console.log('\n📊 Summary:');
        console.log(`✅ Updated: ${updatedCount} installations`);
        console.log(`⏭️  Skipped: ${skippedCount} installations`);
        console.log(`📊 Total processed: ${installations.length} installations`);
        console.log('\n🎉 Database update completed successfully!');

    } catch (error) {
        console.error('❌ Error updating customer links in database:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    updateCustomerLinksInDatabase();
}

module.exports = { updateCustomerLinksInDatabase };