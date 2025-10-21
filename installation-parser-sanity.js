/**
 * TPV Installation Parser - Sanity Version
 * Fetches installations from Sanity CMS for the approval hub
 */

class InstallationParser {
    constructor() {
        this.installations = [];
    }

    /**
     * Convert Portable Text blocks to plain text
     */
    portableTextToPlainText(blocks) {
        if (!blocks || !Array.isArray(blocks)) return '';

        return blocks.map(block => {
            if (block._type === 'block' && block.children) {
                return block.children.map(child => child.text || '').join('');
            }
            return '';
        }).join(' ').trim();
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return 'Date not specified';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    /**
     * Categorize installation based on application field
     */
    categorizeInstallation(application, title = '', description = '') {
        // First try the application field
        if (application) {
            const app = application.toLowerCase();

            if (app.includes('playground') || app.includes('play area') || app.includes('play space')) {
                return 'playground';
            }
            if (app.includes('basketball') || app.includes('sports') || app.includes('tennis') ||
                app.includes('muga') || app.includes('court')) {
                return 'sports';
            }
            if (app.includes('fitness') || app.includes('gym') || app.includes('exercise')) {
                return 'fitness';
            }
            if (app.includes('school') || app.includes('university') || app.includes('educational')) {
                return 'school';
            }
            if (app.includes('water') || app.includes('splash')) {
                return 'water';
            }
        }

        // Fallback to analyzing title and description
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

        return 'playground'; // Default fallback
    }

    /**
     * Parse all installations from Sanity
     */
    async parseAllInstallations() {
        try {
            console.log('Loading installations from Sanity CMS...');

            // Determine API URL (use production if on localhost, otherwise use relative)
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const apiUrl = isLocalhost
                ? 'https://tpv.rosehill.group/.netlify/functions/installations-public?lang=en'
                : '/.netlify/functions/installations-public?lang=en';

            // Fetch from Sanity API endpoint (English content only for approval hub)
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Sanity API error: ${response.status}`);
            }

            const data = await response.json();
            const installationsData = data.installations || [];

            console.log(`Found ${installationsData.length} installations from Sanity`);

            // Transform Sanity data to approval hub format
            this.installations = installationsData.map(installation => {
                // Convert overview (Portable Text) to plain text description
                let description = '';
                let fullContent = '';

                if (installation.overview) {
                    if (Array.isArray(installation.overview)) {
                        // Portable Text blocks
                        fullContent = this.portableTextToPlainText(installation.overview);
                        description = fullContent;
                    } else if (typeof installation.overview === 'string') {
                        description = installation.overview;
                        fullContent = installation.overview;
                    }
                }

                // Build location string
                let locationString = '';
                if (installation.location) {
                    if (typeof installation.location === 'string') {
                        locationString = installation.location;
                    } else if (installation.location.city && installation.location.country) {
                        const city = installation.location.city || '';
                        const country = installation.location.country || '';
                        locationString = `${city}, ${country}`.replace(/^, |, $/, '');
                    }
                }
                if (!locationString) {
                    locationString = 'Location not specified';
                }

                // Build images array from coverImage and gallery
                let images = [];

                // Add cover image
                if (installation.coverImage && installation.coverImage.url) {
                    images.push(installation.coverImage.url);
                }

                // Add gallery images
                if (installation.gallery && Array.isArray(installation.gallery)) {
                    installation.gallery.forEach(img => {
                        if (img && img.url) {
                            images.push(img.url);
                        }
                    });
                }

                // Ensure at least a placeholder if no images
                if (images.length === 0) {
                    images = ['placeholder.jpg'];
                }

                // Format the date
                const formattedDate = this.formatDate(installation.installationDate);

                // Determine category
                const category = this.categorizeInstallation(
                    installation.application,
                    installation.title,
                    description
                );

                return {
                    id: installation._id || installation.slug || `installation-${Date.now()}`,
                    filename: `${installation.slug}.html`,
                    title: installation.title || 'Untitled Installation',
                    description: description,
                    fullContent: fullContent,
                    location: locationString,
                    date: formattedDate,
                    images: images,
                    category: category,
                    application: installation.application || category,
                    slug: installation.slug,
                    // Store original data for reference
                    _sanity: {
                        id: installation._id,
                        slug: installation.slug,
                        installationDate: installation.installationDate
                    }
                };
            });

            // Sort by date (most recent first)
            this.installations.sort((a, b) => {
                const dateA = a._sanity?.installationDate ? new Date(a._sanity.installationDate) : new Date(0);
                const dateB = b._sanity?.installationDate ? new Date(b._sanity.installationDate) : new Date(0);
                return dateB - dateA;
            });

            console.log(`Successfully transformed ${this.installations.length} Sanity installations`);

            return this.installations;

        } catch (error) {
            console.error('Error loading installations from Sanity:', error);

            // Return empty array on error
            console.log('Could not load installations from Sanity. Check that the API endpoint is accessible.');
            throw new Error(`Failed to load installations: ${error.message}`);
        }
    }

    /**
     * Get installations with optional filtering
     */
    getInstallations(filter = null) {
        if (!filter) return this.installations;

        return this.installations.filter(installation => {
            return installation.category === filter;
        });
    }

    /**
     * Search installations
     */
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
