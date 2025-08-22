/**
 * Sanity Client for Admin Operations
 * Handles CRUD operations, image uploads, and queries for the TPV admin interface
 */

class SanityAdminClient {
    constructor() {
        this.projectId = '68ola3dd';
        this.dataset = 'production';
        this.apiVersion = '2023-05-03';
        this.token = null; // Will be set from environment or user input
        this.baseUrl = `https://${this.projectId}.api.sanity.io/v${this.apiVersion}`;
    }

    /**
     * Set the authorization token for API requests
     */
    setToken(token) {
        this.token = token;
    }

    /**
     * Make authenticated API request to Sanity
     */
    async apiRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Sanity API Error (${response.status}): ${error}`);
        }

        return response.json();
    }

    /**
     * Execute a GROQ query
     */
    async query(groq, params = {}) {
        const query = encodeURIComponent(groq);
        const paramString = Object.keys(params).length > 0 
            ? '&' + Object.entries(params).map(([key, value]) => 
                `${encodeURIComponent(`$${key}`)}=${encodeURIComponent(JSON.stringify(value))}`
            ).join('&')
            : '';
        
        const result = await this.apiRequest(`/data/query/${this.dataset}?query=${query}${paramString}`);
        return result.result;
    }

    /**
     * Create a new installation document
     */
    async createInstallation(data) {
        const document = {
            _type: 'installation',
            title: { en: data.title },
            slug: { en: { _type: 'slug', current: this.generateSlug(data.title, data.location) } },
            overview: { en: data.overview },
            location: {
                city: { en: data.city },
                country: { en: data.country },
                coordinates: data.coordinates || null
            },
            installationDate: data.installationDate,
            application: data.application,
            coverImage: data.coverImage || null,
            gallery: data.gallery || [],
            tags: data.tags || [],
            thanksTo: data.thanksTo || null,
            publishedLocales: ['en'],
            translationStatus: {
                en: 'published',
                fr: 'not-started',
                de: 'not-started',
                es: 'not-started'
            }
        };

        const mutations = [{
            create: document
        }];

        const result = await this.apiRequest(`/data/mutate/${this.dataset}`, {
            method: 'POST',
            body: JSON.stringify({ mutations })
        });

        return result.results[0];
    }

    /**
     * Update an existing installation document
     */
    async updateInstallation(id, data, locale = 'en') {
        const mutations = [{
            patch: {
                id: id,
                set: this.buildUpdatePayload(data, locale)
            }
        }];

        const result = await this.apiRequest(`/data/mutate/${this.dataset}`, {
            method: 'POST',
            body: JSON.stringify({ mutations })
        });

        return result.results[0];
    }

    /**
     * Build update payload for different locales
     */
    buildUpdatePayload(data, locale) {
        const payload = {};
        
        if (data.title) payload[`title.${locale}`] = data.title;
        if (data.overview) payload[`overview.${locale}`] = data.overview;
        if (data.city) payload[`location.city.${locale}`] = data.city;
        if (data.country) payload[`location.country.${locale}`] = data.country;
        if (data.installationDate) payload.installationDate = data.installationDate;
        if (data.application) payload.application = data.application;
        if (data.coverImage !== undefined) payload.coverImage = data.coverImage;
        if (data.gallery !== undefined) payload.gallery = data.gallery;
        if (data.tags !== undefined) payload.tags = data.tags;
        if (data.thanksTo !== undefined) payload.thanksTo = data.thanksTo;
        if (data.coordinates !== undefined) payload['location.coordinates'] = data.coordinates;

        return payload;
    }

    /**
     * Delete an installation document
     */
    async deleteInstallation(id) {
        const mutations = [{
            delete: { id: id }
        }];

        const result = await this.apiRequest(`/data/mutate/${this.dataset}`, {
            method: 'POST',
            body: JSON.stringify({ mutations })
        });

        return result.results[0];
    }

    /**
     * Get all installations with optional filtering and sorting
     */
    async getInstallations(options = {}) {
        const { search, application, sortBy, sortOrder, limit, offset } = options;
        
        let query = '*[_type == "installation"';
        const params = {};

        // Add search filter
        if (search) {
            query += ` && (title.en match $search || location.city.en match $search || location.country.en match $search)`;
            params.search = `*${search}*`;
        }

        // Add application filter
        if (application && application !== 'all') {
            query += ` && application == $application`;
            params.application = application;
        }

        query += ']';

        // Add sorting
        if (sortBy) {
            const direction = sortOrder === 'desc' ? 'desc' : 'asc';
            switch (sortBy) {
                case 'date':
                    query += ` | order(installationDate ${direction})`;
                    break;
                case 'title':
                    query += ` | order(title.en ${direction})`;
                    break;
                case 'location':
                    query += ` | order(location.city.en ${direction})`;
                    break;
                default:
                    query += ` | order(installationDate desc)`;
            }
        } else {
            query += ` | order(installationDate desc)`;
        }

        // Add pagination
        if (offset) query += `[${offset}...`;
        if (limit) query += `${offset || ''}${limit}]`;
        else if (offset) query += ']';

        // Select fields
        query += `{
            _id,
            title,
            slug,
            overview,
            location,
            installationDate,
            application,
            coverImage,
            gallery[0...3],
            publishedLocales,
            translationStatus,
            _updatedAt
        }`;

        return this.query(query, params);
    }

    /**
     * Get a single installation by ID
     */
    async getInstallation(id) {
        const query = `*[_type == "installation" && _id == $id][0]{
            _id,
            title,
            slug,
            overview,
            location,
            installationDate,
            application,
            coverImage,
            gallery,
            tags,
            thanksTo,
            publishedLocales,
            translationStatus,
            seo,
            _updatedAt
        }`;
        
        return this.query(query, { id });
    }

    /**
     * Upload an image to Sanity assets
     */
    async uploadImage(file, filename = null) {
        const formData = new FormData();
        formData.append('file', file);
        
        if (filename) {
            formData.append('filename', filename);
        }

        const response = await fetch(`${this.baseUrl}/assets/images/${this.dataset}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Image upload failed: ${error}`);
        }

        return response.json();
    }

    /**
     * Delete an asset from Sanity
     */
    async deleteAsset(assetId) {
        const mutations = [{
            delete: { id: assetId }
        }];

        const result = await this.apiRequest(`/data/mutate/${this.dataset}`, {
            method: 'POST',
            body: JSON.stringify({ mutations })
        });

        return result.results[0];
    }

    /**
     * Generate a slug from title and location
     */
    generateSlug(title, location = '') {
        const text = `${title} ${location}`.toLowerCase();
        return text
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            .replace(/^-|-$/g, '');
    }

    /**
     * Update translation status for a specific locale
     */
    async updateTranslationStatus(id, locale, status) {
        const mutations = [{
            patch: {
                id: id,
                set: {
                    [`translationStatus.${locale}`]: status
                }
            }
        }];

        const result = await this.apiRequest(`/data/mutate/${this.dataset}`, {
            method: 'POST',
            body: JSON.stringify({ mutations })
        });

        return result.results[0];
    }

    /**
     * Add a locale to publishedLocales array
     */
    async publishLocale(id, locale) {
        const installation = await this.getInstallation(id);
        if (!installation) throw new Error('Installation not found');

        const publishedLocales = installation.publishedLocales || ['en'];
        if (!publishedLocales.includes(locale)) {
            publishedLocales.push(locale);
        }

        const mutations = [{
            patch: {
                id: id,
                set: {
                    publishedLocales: publishedLocales,
                    [`translationStatus.${locale}`]: 'published'
                }
            }
        }];

        const result = await this.apiRequest(`/data/mutate/${this.dataset}`, {
            method: 'POST',
            body: JSON.stringify({ mutations })
        });

        return result.results[0];
    }

    /**
     * Get installation statistics
     */
    async getStatistics() {
        const query = `{
            "total": count(*[_type == "installation"]),
            "byApplication": *[_type == "installation"] | {
                "application": application,
                "count": count(*)
            } | group(application),
            "recentInstallations": *[_type == "installation"] | order(installationDate desc)[0...5]{
                title.en,
                location.city.en,
                installationDate
            },
            "translationStats": {
                "english": count(*[_type == "installation" && "en" in publishedLocales]),
                "french": count(*[_type == "installation" && "fr" in publishedLocales]),
                "german": count(*[_type == "installation" && "de" in publishedLocales]),
                "spanish": count(*[_type == "installation" && "es" in publishedLocales])
            }
        }`;

        return this.query(query);
    }

    /**
     * Validate required fields for installation
     */
    validateInstallation(data) {
        const errors = [];

        if (!data.title?.trim()) errors.push('Title is required');
        if (!data.overview?.trim()) errors.push('Overview is required');
        if (!data.city?.trim()) errors.push('City is required');
        if (!data.country?.trim()) errors.push('Country is required');
        if (!data.installationDate) errors.push('Installation date is required');
        if (!data.application) errors.push('Application type is required');

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get asset URL for images
     */
    getImageUrl(asset, options = {}) {
        if (!asset || !asset._ref) return null;
        
        const { width, height, fit, format } = options;
        let url = `https://cdn.sanity.io/images/${this.projectId}/${this.dataset}/${asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`;
        
        const params = [];
        if (width) params.push(`w=${width}`);
        if (height) params.push(`h=${height}`);
        if (fit) params.push(`fit=${fit}`);
        if (format) params.push(`fm=${format}`);
        
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        
        return url;
    }
}

// Initialize the client
const sanityClient = new SanityAdminClient();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SanityAdminClient;
} else if (typeof window !== 'undefined') {
    window.SanityAdminClient = SanityAdminClient;
    window.sanityClient = sanityClient;
}