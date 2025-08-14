const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing required environment variables');
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

// Manual mapping of known installations to their customer companies
const installationMappings = {
    'Recent Upgrade To Griffith Park': ['Australian Sports & Safety Surfaces', 'Surface Designs TPV'],
    'Renovated Community Play Area At Maunder Reserve': ['Glooloop Surfacing', 'Surface Designs TPV'],
    'Piney Lakes Sensory Playground': ['Perth Playground & Rubber', 'Surface Designs TPV'],
    'Te Kapua Park Playground': ['NumatREC', 'Bespoke Landscape Architects'],
    'Butlin\'s SKYPARK Playground': ['Abacus Playgrounds', 'Jupiter Play & Leisure Ltd'],
    'Basketball Court Installation In Nijmegen': ['GCC Sport Surfaces'],
    'Playground Transformation With Rosehill TPV': ['VALORIZA ECORUBBER'],
    'New Community Playground In Wanneroo': ['Perth Playground & Rubber', 'Surface Designs TPV'],
    'Coastal Playground Installation In Iquique': ['Full urbano'],
    'Carmelita Carvajal Kindergarten Play Area': ['Full urbano'],
    'Kindergarten\'s New Playground': ['Full urbano'],
    'Chilean Playground Installation With Paint-Inspired Motifs': ['Full urbano'],
    'New Fitness Area In Maipú': ['Full urbano'],
    'Vibrant New Basketball Court': ['Full urbano'],
    'Nursery\'s New Soft-Fall Surface': ['Full urbano'],
    'Coastal Public Fitness Area': ['Full urbano'],
    'Playground Transformations Across Chile': ['Full urbano'],
    'Multiple New Projects From Across Chile': ['Full urbano'],
    'New Playground At Campo Castelo Park': ['VALORIZA ECORUBBER'],
    'Vibrant Splash Park In Mijas': ['VALORIZA ECORUBBER'],
    'New Community Space In El Raval': ['VALORIZA ECORUBBER'],
    'Shopping Centre Play Area': ['VALORIZA ECORUBBER'],
    'Barcelona\'s Parc De Les Glòries Vibrent Transformation': ['ENZA SOLUCIONES Y SERVICIOS SL', 'VALORIZA ECORUBBER'],
    'The Club Hotel Aguamarina\'s Marine Life-inspired Playground': ['HAGS ESPAÑA', 'VALORIZA ECORUBBER'],
    'Kings Road Playground': ['The Win Win Group'],
    'Fully Complete Basketball Court At Nike\'s Headquarters': ['Flexidal'],
    'Ysgol Cedewain Playground': ['Abacus Playgrounds'],
    'Butlin\'s Minehead Holiday Site\'s New SKYPARK Playground': ['Abacus Playgrounds', 'Jupiter Play & Leisure Ltd'],
    'Beach-Themed Play Area': ['Perth Playground & Rubber', 'Surface Designs TPV'],
    'New Playground At Rosalie Park': ['Perth Playground & Rubber', 'Surface Designs TPV'],
    'Vibrent Rosehill TPV Playground': ['Perth Playground & Rubber', 'Surface Designs TPV'],
    'New Community Fitness Area At Webber Reserve': ['Perth Playground & Rubber', 'KOMPAN Australia', 'Surface Designs TPV'],
    'New Outdoor Gym In Baldivis': ['Perth Playground & Rubber', 'Mirvac', 'Surface Designs TPV'],
    'Community Playground Installation': ['Perth Playground & Rubber', 'Surface Designs TPV', 'LD Total'],
    'Yellowwood Park Parkour Fitness Area': ['Perth Playground & Rubber', 'Surface Designs TPV', 'Gecko Contracting'],
    'Splash Of Fun With 3D Balancing Blocks': ['Rubberworx', 'Surface Designs TPV']
};

async function fixCustomerLinks() {
    try {
        console.log('🔧 Fixing customer links with correct company mappings...');
        
        const customerUrls = loadCustomerUrls();
        console.log(`Loaded ${Object.keys(customerUrls).length} customer URL mappings`);
        
        // Get all installations
        const { data: installations, error } = await supabase
            .from('installations')
            .select('id, title, description');

        if (error) {
            throw new Error(`Failed to fetch installations: ${error.message}`);
        }

        let fixedCount = 0;
        
        // Process each installation
        for (const installation of installations) {
            const { id, title, description } = installation;
            
            // Check if this installation has a known mapping
            const companies = installationMappings[title];
            if (!companies) {
                continue;
            }
            
            console.log(`🔧 Fixing "${title}" with companies: ${companies.join(', ')}`);
            
            let updatedDescription;
            
            if (Array.isArray(description)) {
                updatedDescription = description.map((paragraph, index) => {
                    // Update the thanks paragraph
                    if (paragraph && paragraph.toLowerCase().includes('thanks')) {
                        const linkedCompanies = companies.map(company => {
                            const url = customerUrls[company];
                            if (url) {
                                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${company}</a>`;
                            }
                            return company;
                        });
                        
                        return `Thanks to ${linkedCompanies.join(' and ')}`;
                    }
                    return paragraph;
                });
            } else if (typeof description === 'string') {
                // Handle string descriptions
                if (description.toLowerCase().includes('thanks')) {
                    const linkedCompanies = companies.map(company => {
                        const url = customerUrls[company];
                        if (url) {
                            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${company}</a>`;
                        }
                        return company;
                    });
                    
                    updatedDescription = description.replace(/thanks to.*/i, `Thanks to ${linkedCompanies.join(' and ')}`);
                } else {
                    continue;
                }
            }
            
            // Update the installation
            const { error: updateError } = await supabase
                .from('installations')
                .update({ description: updatedDescription })
                .eq('id', id);
            
            if (updateError) {
                console.error(`❌ Failed to fix "${title}":`, updateError.message);
            } else {
                console.log(`✅ Fixed "${title}"`);
                fixedCount++;
            }
        }
        
        console.log(`\n✅ Fixed ${fixedCount} installations with correct customer links`);

    } catch (error) {
        console.error('❌ Error fixing customer links:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    fixCustomerLinks();
}

module.exports = { fixCustomerLinks };