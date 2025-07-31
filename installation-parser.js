/**
 * TPV Installation Parser
 * Extracts content from installation HTML files for the approval hub
 */

class InstallationParser {
    constructor() {
        this.installations = [];
        this.installationFiles = [];
    }

    // Get list of installation HTML files
    async getInstallationFiles() {
        // Use predefined list of installation files (excluding backups)
        this.installationFiles = [
            'award-winning-playground-small-town-of-trangi-new-zealand.html',
            'barcelona-s-parc-de-les-gl-ries-vibrent-transformation.html',
            'beach-themed-play-area-goomalling-australia.html',
            'blue-rosehill-tpv-surface-at-a-community-playground-wanneroo.html',
            'colourful-softfall-surface-ancud-kindergarten.html',
            'community-play-area-at-maunder-reserve-guildford.html',
            'community-playground-valdiva-chile.html',
            'disability-friendly-play-space-northern-beaches-area-australia.html',
            'earth-themed-play-space-located-outside-vall-d-hebron-children-s-hospital.html',
            'exciting-renovation-wollundry-park-in-nsw-australia.html',
            'fitness-area-installed-port-fairy-consolidated-school.html',
            'full-renovation-of-memorial-park-playground-donald-australia.html',
            'fully-complete-basketball-court-at-nikes-headquarters-1753440448948.html',
            'hassell-park-caterpiller-playground-new-south-wales.html',
            'hillview-christian-school-vibrant-new-playground.html',
            'kareela-reserve-playground-frankston-is-undergoing-an-exciting-renovation-featuring-rosehill-tpv-softfall-surfaces.html',
            'kings-road-playground-north-point-hong-kong.html',
            'latest-rosehill-tpv-installation-australian-school-playground.html',
            'lingnan-university-s-new-outdoor-fitness-gym.html',
            'madrid-playground-transformation-with-rosehill-tpv.html',
            'marine-life-inspired-playground-arenal-den-castell-menorca.html',
            'multiply-new-projects-from-across-chile-1753439763052.html',
            'new-fitness-area-webber-reserve-in-perth-australia.html',
            'new-jungle-themed-play-area-westfield-parramatta-shopping-centre.html',
            'new-park-el-raval-barcelona.html',
            'new-play-area-foulath-clubhouse-in-al-hidd-bahrain.html',
            'new-playground-area-whitten-oval-in-footscray-australia.html',
            'new-playground-installed-glover-recreation-reserve.html',
            'new-playground-installed-lowther-hall-school.html',
            'new-playground-surface-pinnacle-park.html',
            'new-playspace-featuring-rosehill-tpv-so-paulo-brazil.html',
            'new-rosehill-tpv-softfall-surface-caburn-park-in-wingello-australia.html',
            'new-soft-fall-surface-a-nursery-in-los-ngeles-chile.html',
            'new-softfall-surface-being-installed-along-the-coastline-of-iquique-chile.html',
            'new-softfall-surface-outdoor-gym-in-baldivis-western-australia.html',
            'newly-installed-playground-belgrade-serbia.html',
            'newly-installed-playground-nedachlebice-czech-republic.html',
            'one-year-since-butlin-s-skegness-skypark-playground-officially-opened.html',
            'playground-installation-coastal-city-of-iquique-chile.html',
            'playground-installation-in-sulaymaniyah-1753435623123.html',
            'playground-installation-petting-zoo-in-donji-tovarnik-serbia.html',
            'playground-installation-sulaymaniyah-iraq.html',
            'playground-transformations-across-araucan-a-region-of-chile.html',
            'playground-transformed-cheltenham-primary-school.html',
            'playground-upgrade-maunder-reserve-in-guildford-sydney.html',
            'public-fitness-area-iquique-chile.html',
            'public-outdoor-gym-installation-at-hung-hom-bay-1753437923978.html',
            'recent-addition-of-an-obstacle-course-lowther-hall-anglican-grammar-school.html',
            'recent-renovation-of-uncle-buck-s-play-parlour-at-the-buckley-s-entertainment-centre.html',
            'recent-renovation-piney-lakes-sensory-playground.html',
            'recent-upgrade-to-the-play-area-griffith-park-sydney.html',
            'renovation-featuring-rosehill-tpv-marsden-park-playground-in-campbelltown-adelaide.html',
            'renovations-a-public-park-in-freshwater-beach-nsw.html',
            'rosehill-tpv-featured-sydneys-iconic-olympic-park.html',
            'rosehill-tpv-installation-canberra-national-zoo.html',
            'rosehill-tpv-softfall-surface-installed-austin-amp-mercy-hospital.html',
            'rosehill-tpv-softfall-surface-vergara-park-in-angol-chile.html',
            'rosehill-tpv-softfall-surfacing-at-campo-castelo-park-spain.html',
            'rosehill-tpv-softfall-surfacing-rosalie-park-australia.html',
            'safe-and-vibrant-school-play-area-new-south-wales.html',
            'second-stage-of-renovations-buckleys-entertainment-centre.html',
            'shopping-centre-play-area-madrid-spain.html',
            'skypark-playground-minehead-butlins-holiday-site-somerset.html',
            'splash-of-fun-australian-playground.html',
            'standout-basketball-court-installation-nikes-headquarters-belgium.html',
            'transformed-play-area-carmelita-carvajal-kindergarten-chile.html',
            'unique-play-area-darling-harbour-sydney.html',
            'upgraded-indoor-play-area-inside-canberra-centre-australian-capital-territory.html',
            'vibrant-community-space-barton-park-sydney.html',
            'vibrant-new-basketball-court-general-cruz-chile.html',
            'vibrant-new-water-park-birchip.html',
            'vibrant-softfall-surface-macquarie-fields-sydney.html',
            'vibrant-splash-park-mijas-costa-del-sol.html',
            'vibrent-fitness-area-maip-chile.html',
            'vibrent-tpv-snake-addition-to-a-school-perth.html',
            'yellowwood-park-parkour-fitness-area.html',
            'ysgol-cedewain-playground-wales.html'
        ];
        
        return this.installationFiles;
    }

    // Parse a single installation HTML file
    async parseInstallationFile(filename) {
        try {
            // Use the correct URL structure for the live site
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/installations/${filename}`);
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract data from the HTML
            const installation = {
                id: filename.replace('.html', ''),
                filename: filename
            };

            // Extract title
            const titleElement = doc.querySelector('title');
            if (titleElement) {
                installation.title = titleElement.textContent
                    .replace(' | Rosehill TPV Installation', '')
                    .replace('Rosehill TPV', '')
                    .trim();
            } else {
                installation.title = filename.replace('.html', '').replace(/-/g, ' ');
            }

            // Extract meta description
            const descElement = doc.querySelector('meta[name="description"]');
            if (descElement) {
                installation.description = descElement.getAttribute('content');
            } else {
                installation.description = 'Rosehill TPV installation details featuring high-quality rubber granules for safe, vibrant surfaces.';
            }

            // Extract location from meta keywords or content
            const keywordsElement = doc.querySelector('meta[name="keywords"]');
            if (keywordsElement) {
                const keywords = keywordsElement.getAttribute('content');
                installation.location = this.extractLocationFromKeywords(keywords);
            }

            // Extract date from structured data or content
            const structuredDataScript = doc.querySelector('script[type="application/ld+json"]');
            if (structuredDataScript) {
                try {
                    const structuredData = JSON.parse(structuredDataScript.textContent);
                    if (structuredData.datePublished) {
                        installation.date = structuredData.datePublished;
                    }
                } catch (e) {
                    console.warn('Error parsing structured data:', e);
                }
            }

            // Extract images from multiple sources
            const images = [];
            
            // Check main image in picture element
            const mainImageElement = doc.querySelector('.main-image');
            if (mainImageElement) {
                const src = mainImageElement.getAttribute('src');
                if (src && src.includes('images/installations/')) {
                    const imageName = src.split('/').pop();
                    if (!images.includes(imageName)) {
                        images.push(imageName);
                    }
                }
            }
            
            // Check image gallery
            const imageElements = doc.querySelectorAll('.image-gallery img');
            imageElements.forEach(img => {
                const src = img.getAttribute('src');
                if (src && src.includes('images/installations/')) {
                    const imageName = src.split('/').pop();
                    if (!images.includes(imageName)) {
                        images.push(imageName);
                    }
                }
            });

            // Check JavaScript for image arrays (most reliable method)
            const scripts = doc.querySelectorAll('script');
            scripts.forEach(script => {
                const content = script.textContent;
                // Look for const images = [...] pattern
                const imageArrayMatch = content.match(/const images = \[(.*?)\]/s);
                if (imageArrayMatch) {
                    const imageList = imageArrayMatch[1]
                        .split(',')
                        .map(img => img.replace(/['"]/g, '').trim())
                        .filter(img => img.length > 0);
                    imageList.forEach(img => {
                        if (!images.includes(img)) {
                            images.push(img);
                        }
                    });
                }
            });

            installation.images = images.length > 0 ? images : ['placeholder.jpg'];

            // Extract full content from project overview
            const contentSection = doc.querySelector('.content-section p, .project-overview p');
            if (contentSection) {
                installation.fullContent = contentSection.textContent.trim();
            } else {
                installation.fullContent = installation.description;
            }

            // Categorize the installation
            installation.category = this.categorizeInstallation(installation.title, installation.description);

            // Set default date if none found
            if (!installation.date) {
                installation.date = 'Date not specified';
            }

            // Set default location if none found
            if (!installation.location) {
                installation.location = this.extractLocationFromTitle(installation.title);
            }

            // Debug logging for first few installations
            if (installation.id === 'award-winning-playground-small-town-of-trangi-new-zealand') {
                console.log('Debug fetched HTML length:', html.length);
                console.log('Debug HTML preview:', html.substring(0, 500));
                console.log('Debug title element found:', doc.querySelector('title'));
                console.log('Debug meta description found:', doc.querySelector('meta[name="description"]'));
                console.log('Debug structured data found:', doc.querySelector('script[type="application/ld+json"]'));
                console.log('Debug installation data:', {
                    title: installation.title,
                    description: installation.description,
                    location: installation.location,
                    date: installation.date,
                    images: installation.images,
                    category: installation.category
                });
            }

            return installation;

        } catch (error) {
            console.error(`Error parsing ${filename}:`, error);
            return {
                id: filename.replace('.html', ''),
                filename: filename,
                title: `Error loading: ${filename}`,
                description: 'Could not load this installation',
                location: 'Unknown',
                date: 'Unknown',
                images: [],
                category: 'other',
                fullContent: 'Content could not be loaded'
            };
        }
    }

    // Extract location from keywords
    extractLocationFromKeywords(keywords) {
        if (!keywords) return 'Location not specified';
        
        const keywordArray = keywords.split(',').map(k => k.trim());
        
        // Look for location patterns in keywords
        const locationPatterns = [
            /Australia/i, /New Zealand/i, /Spain/i, /Chile/i, /Belgium/i,
            /UK/i, /United Kingdom/i, /England/i, /Scotland/i, /Wales/i,
            /Barcelona/i, /Madrid/i, /Sydney/i, /Melbourne/i, /Perth/i,
            /London/i, /Manchester/i, /Birmingham/i, /Hong Kong/i, /Serbia/i,
            /Czech Republic/i, /Iraq/i, /Brazil/i, /Menorca/i
        ];

        // First try to find country/region matches
        for (const keyword of keywordArray) {
            for (const pattern of locationPatterns) {
                if (pattern.test(keyword)) {
                    return keyword;
                }
            }
        }

        // If no pattern match, look for keywords that contain place names
        for (const keyword of keywordArray) {
            if (keyword.length > 3 && 
                !keyword.toLowerCase().includes('rosehill') &&
                !keyword.toLowerCase().includes('tpv') &&
                !keyword.toLowerCase().includes('rubber') &&
                !keyword.toLowerCase().includes('surfacing') &&
                !keyword.toLowerCase().includes('playground') &&
                !keyword.toLowerCase().includes('safety') &&
                (keyword.includes('Town') || keyword.includes('City') || 
                 keyword.includes('.') || keyword.includes('Park') ||
                 /^[A-Z][a-z]+\s[A-Z][a-z]+/.test(keyword))) {
                return keyword;
            }
        }

        return 'Location not specified';
    }

    // Extract location from title as fallback
    extractLocationFromTitle(title) {
        const locationPatterns = [
            /Australia/i, /New Zealand/i, /Spain/i, /Chile/i, /Belgium/i,
            /Barcelona/i, /Madrid/i, /Sydney/i, /Melbourne/i, /Perth/i,
            /Hong Kong/i, /Serbia/i, /Czech Republic/i, /Iraq/i
        ];

        for (const pattern of locationPatterns) {
            const match = title.match(pattern);
            if (match) {
                return match[0];
            }
        }

        return 'Location not specified';
    }

    // Categorize installation based on title and description
    categorizeInstallation(title, description) {
        const text = (title + ' ' + description).toLowerCase();

        if (text.includes('playground') || text.includes('play area') || text.includes('play space')) {
            return 'playground';
        }
        
        if (text.includes('basketball') || text.includes('sports court') || text.includes('tennis') || 
            text.includes('volleyball') || text.includes('court')) {
            return 'sports';
        }
        
        if (text.includes('fitness') || text.includes('gym') || text.includes('exercise') || 
            text.includes('workout') || text.includes('obstacle course')) {
            return 'fitness';
        }
        
        if (text.includes('school') || text.includes('university') || text.includes('college') || 
            text.includes('educational') || text.includes('kindergarten')) {
            return 'school';
        }
        
        if (text.includes('splash') || text.includes('water park') || text.includes('aquatic')) {
            return 'water';
        }

        return 'other';
    }

    // Parse all installation files
    async parseAllInstallations() {
        try {
            await this.getInstallationFiles();
            console.log(`Found ${this.installationFiles.length} installation files`);

            const installations = [];
            
            // Parse files in batches to avoid overwhelming the browser
            const batchSize = 10;
            for (let i = 0; i < this.installationFiles.length; i += batchSize) {
                const batch = this.installationFiles.slice(i, i + batchSize);
                const batchPromises = batch.map(filename => this.parseInstallationFile(filename));
                const batchResults = await Promise.all(batchPromises);
                installations.push(...batchResults);
                
                // Show progress
                console.log(`Parsed ${Math.min(i + batchSize, this.installationFiles.length)} of ${this.installationFiles.length} installations`);
            }

            this.installations = installations.filter(inst => inst !== null);
            return this.installations;

        } catch (error) {
            console.error('Error parsing installations:', error);
            
            // Return empty array if parsing fails completely
            console.log('Could not parse installations. Please check the installations directory.');
            return [];
        }
    }

    // Generate fallback sample data if parsing fails
    generateFallbackData() {
        const sampleInstallations = [];
        const titles = [
            'Award-winning Playground - Tūrangi, New Zealand',
            'Barcelona Park Transformation - Spain',
            'Nike Basketball Court - Belgium',
            'Butlins Skypark Playground - UK',
            'Sydney Olympic Park Installation - Australia',
            'Madrid Shopping Centre Play Area - Spain',
            'Chilean Basketball Court - Chile',
            'Hong Kong Fitness Area - Hong Kong',
            'Serbian Playground Installation - Serbia',
            'Czech Republic School Project - Czech Republic'
        ];

        const locations = [
            'New Zealand', 'Spain', 'Belgium', 'United Kingdom', 'Australia',
            'Spain', 'Chile', 'Hong Kong', 'Serbia', 'Czech Republic'
        ];

        const categories = [
            'playground', 'playground', 'sports', 'playground', 'sports',
            'playground', 'sports', 'fitness', 'playground', 'school'
        ];

        for (let i = 0; i < titles.length; i++) {
            sampleInstallations.push({
                id: `sample-installation-${i + 1}`,
                filename: `sample-${i + 1}.html`,
                title: titles[i],
                location: locations[i],
                description: `A fantastic ${categories[i]} installation featuring Rosehill TPV® surfacing, providing exceptional safety and durability for users of all ages. This project showcases the quality and versatility of our premium safety surfacing solutions.`,
                date: `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/2024`,
                images: [`sample-image-${i + 1}.jpg`],
                category: categories[i],
                fullContent: `This ${categories[i]} installation in ${locations[i]} demonstrates the exceptional quality and performance of Rosehill TPV® surfacing. The project was completed to the highest standards, providing long-lasting safety and durability. The vibrant colors and superior UV resistance ensure the surface maintains its appearance and performance for years to come.`
            });
        }

        // Add more sample data to reach a good number for testing
        for (let i = 10; i < 50; i++) {
            const categoryIndex = Math.floor(Math.random() * categories.length);
            const locationIndex = Math.floor(Math.random() * locations.length);
            
            sampleInstallations.push({
                id: `sample-installation-${i + 1}`,
                filename: `sample-${i + 1}.html`,
                title: `${categories[categoryIndex].charAt(0).toUpperCase() + categories[categoryIndex].slice(1)} Installation ${i + 1}`,
                location: locations[locationIndex],
                description: `A professional ${categories[categoryIndex]} installation featuring premium Rosehill TPV® surfacing technology.`,
                date: `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/2024`,
                images: [`sample-image-${i + 1}.jpg`],
                category: categories[categoryIndex],
                fullContent: `Professional ${categories[categoryIndex]} installation completed in ${locations[locationIndex]} using Rosehill TPV® surfacing materials.`
            });
        }

        return sampleInstallations;
    }

    // Get installations with optional filtering
    getInstallations(filter = null) {
        if (!filter) return this.installations;
        
        return this.installations.filter(installation => {
            return installation.category === filter;
        });
    }

    // Search installations
    searchInstallations(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.installations.filter(installation => {
            return installation.title.toLowerCase().includes(term) ||
                   installation.location.toLowerCase().includes(term) ||
                   installation.description.toLowerCase().includes(term);
        });
    }
}

// Export for use in the main application
window.InstallationParser = InstallationParser;