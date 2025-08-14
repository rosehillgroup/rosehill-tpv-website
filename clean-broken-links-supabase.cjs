const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing required environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Remove broken links from installation descriptions
 */
async function cleanBrokenLinks() {
    try {
        console.log('🧹 Cleaning broken links from database...');
        
        // Get all installations from Supabase
        const { data: installations, error } = await supabase
            .from('installations')
            .select('id, title, description');

        if (error) {
            throw new Error(`Failed to fetch installations: ${error.message}`);
        }

        console.log(`Found ${installations.length} installations`);
        
        let cleanedCount = 0;
        
        // Process each installation
        for (const installation of installations) {
            const { id, title, description } = installation;
            
            let needsCleaning = false;
            let cleanedDescription;
            
            if (Array.isArray(description)) {
                cleanedDescription = description.map(paragraph => {
                    if (typeof paragraph === 'string' && paragraph.includes('<a href=')) {
                        needsCleaning = true;
                        
                        // Remove broken nested links like <a href="url"><a href="url2">text</a></a>
                        let cleaned = paragraph;
                        
                        // Remove nested links - find patterns like <a href="..."><a href="...">text</a></a>
                        cleaned = cleaned.replace(/<a href="[^"]*"><a href="[^"]*"[^>]*>([^<]*)<\/a><\/a>/gi, '$1');
                        
                        // Remove malformed links like href="url" target="..." followed by >text
                        cleaned = cleaned.replace(/href="[^"]*"\s*target="[^"]*"\s*[^>]*>([^<]*)</gi, '$1');
                        
                        // Remove any remaining standalone link tags
                        cleaned = cleaned.replace(/<a href="[^"]*"[^>]*>([^<]*)<\/a>/gi, '$1');
                        
                        // Clean up any remaining HTML fragments
                        cleaned = cleaned.replace(/href="[^"]*"/gi, '');
                        cleaned = cleaned.replace(/target="_blank"/gi, '');
                        cleaned = cleaned.replace(/rel="noopener noreferrer"/gi, '');
                        cleaned = cleaned.replace(/style="[^"]*"/gi, '');
                        cleaned = cleaned.replace(/<\/?a[^>]*>/gi, '');
                        
                        // Clean up extra spaces
                        cleaned = cleaned.replace(/\s+/g, ' ').trim();
                        
                        return cleaned;
                    }
                    return paragraph;
                });
            } else if (typeof description === 'string' && description.includes('<a href=')) {
                needsCleaning = true;
                let cleaned = description;
                
                // Same cleaning process for string descriptions
                cleaned = cleaned.replace(/<a href="[^"]*"><a href="[^"]*"[^>]*>([^<]*)<\/a><\/a>/gi, '$1');
                cleaned = cleaned.replace(/href="[^"]*"\s*target="[^"]*"\s*[^>]*>([^<]*)</gi, '$1');
                cleaned = cleaned.replace(/<a href="[^"]*"[^>]*>([^<]*)<\/a>/gi, '$1');
                cleaned = cleaned.replace(/href="[^"]*"/gi, '');
                cleaned = cleaned.replace(/target="_blank"/gi, '');
                cleaned = cleaned.replace(/rel="noopener noreferrer"/gi, '');
                cleaned = cleaned.replace(/style="[^"]*"/gi, '');
                cleaned = cleaned.replace(/<\/?a[^>]*>/gi, '');
                cleaned = cleaned.replace(/\s+/g, ' ').trim();
                
                cleanedDescription = cleaned;
            }
            
            // Update the installation if it needs cleaning
            if (needsCleaning) {
                console.log(`🧹 Cleaning "${title}"`);
                
                const { error: updateError } = await supabase
                    .from('installations')
                    .update({ description: cleanedDescription })
                    .eq('id', id);
                
                if (updateError) {
                    console.error(`❌ Failed to clean "${title}":`, updateError.message);
                } else {
                    cleanedCount++;
                }
            }
        }
        
        console.log(`\n✅ Cleaned ${cleanedCount} installations`);
        console.log('🔄 Database is now ready for fresh customer links');

    } catch (error) {
        console.error('❌ Error cleaning broken links:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    cleanBrokenLinks();
}

module.exports = { cleanBrokenLinks };