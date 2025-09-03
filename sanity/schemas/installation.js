// Sanity schema for installations with multilingual support
// English is the source, ES/FR/DE are auto-translated mirrors

export default {
  name: 'installation',
  title: 'Installation',
  type: 'document',
  fields: [
    // ========== English Source Fields ==========
    {
      name: 'title',
      title: 'Title (English)',
      type: 'string',
      validation: Rule => Rule.required().error('Title is required')
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        slugify: input => input
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .slice(0, 96)
      },
      validation: Rule => Rule.required().error('Slug is required')
    },
    {
      name: 'installationDate',
      title: 'Installation Date',
      type: 'date',
      validation: Rule => Rule.required().error('Installation date is required')
    },
    {
      name: 'application',
      title: 'Application Type',
      type: 'string',
      options: {
        list: [
          { title: 'Playground', value: 'playground' },
          { title: 'Sports Court', value: 'sports' },
          { title: 'Athletics Track', value: 'athletics' },
          { title: 'Tennis Court', value: 'tennis' },
          { title: 'Fitness Area', value: 'fitness' },
          { title: 'Water Park', value: 'water' },
          { title: 'Other', value: 'other' }
        ]
      }
    },
    
    // ========== Location (with translations) ==========
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'city', title: 'City (English)', type: 'string' },
        { name: 'country', title: 'Country (English)', type: 'string' },
        { name: 'city__es', title: 'City (Spanish)', type: 'string' },
        { name: 'country__es', title: 'Country (Spanish)', type: 'string' },
        { name: 'city__fr', title: 'City (French)', type: 'string' },
        { name: 'country__fr', title: 'Country (French)', type: 'string' },
        { name: 'city__de', title: 'City (German)', type: 'string' },
        { name: 'country__de', title: 'Country (German)', type: 'string' }
      ]
    },
    
    // ========== Content Blocks (with translations) ==========
    {
      name: 'overview',
      title: 'Overview (English)',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'overview__es',
      title: 'Overview (Spanish)',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'overview__fr',
      title: 'Overview (French)',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'overview__de',
      title: 'Overview (German)',
      type: 'array',
      of: [{ type: 'block' }]
    },
    
    {
      name: 'thanksTo',
      title: 'Thanks To (English)',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'thanksTo__es',
      title: 'Thanks To (Spanish)',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'thanksTo__fr',
      title: 'Thanks To (French)',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'thanksTo__de',
      title: 'Thanks To (German)',
      type: 'array',
      of: [{ type: 'block' }]
    },
    
    // ========== Translated Title Fields ==========
    {
      name: 'title__es',
      title: 'Title (Spanish)',
      type: 'string'
    },
    {
      name: 'title__fr',
      title: 'Title (French)',
      type: 'string'
    },
    {
      name: 'title__de',
      title: 'Title (German)',
      type: 'string'
    },
    
    // ========== Media ==========
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text (English)',
          type: 'string'
        },
        {
          name: 'alt__es',
          title: 'Alt Text (Spanish)',
          type: 'string'
        },
        {
          name: 'alt__fr',
          title: 'Alt Text (French)',
          type: 'string'
        },
        {
          name: 'alt__de',
          title: 'Alt Text (German)',
          type: 'string'
        }
      ],
      validation: Rule => Rule.required().error('Cover image is required')
    },
    {
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text (English)',
              type: 'string'
            },
            {
              name: 'alt__es',
              title: 'Alt Text (Spanish)',
              type: 'string'
            },
            {
              name: 'alt__fr',
              title: 'Alt Text (French)',
              type: 'string'
            },
            {
              name: 'alt__de',
              title: 'Alt Text (German)',
              type: 'string'
            }
          ]
        }
      ],
      validation: Rule => Rule.max(12).warning('Maximum 12 images recommended for performance')
    },
    
    // ========== SEO (with translations) ==========
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', title: 'SEO Title (English)', type: 'string' },
        { name: 'description', title: 'SEO Description (English)', type: 'text', rows: 3 },
        { name: 'title__es', title: 'SEO Title (Spanish)', type: 'string' },
        { name: 'description__es', title: 'SEO Description (Spanish)', type: 'text', rows: 3 },
        { name: 'title__fr', title: 'SEO Title (French)', type: 'string' },
        { name: 'description__fr', title: 'SEO Description (French)', type: 'text', rows: 3 },
        { name: 'title__de', title: 'SEO Title (German)', type: 'string' },
        { name: 'description__de', title: 'SEO Description (German)', type: 'text', rows: 3 }
      ]
    },
    
    // ========== Admin Metadata ==========
    {
      name: 'publishedLocales',
      title: 'Published Locales',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Spanish', value: 'es' },
          { title: 'French', value: 'fr' },
          { title: 'German', value: 'de' }
        ]
      },
      initialValue: ['en']
    },
    {
      name: 'translationStatus',
      title: 'Translation Status',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish Status', type: 'string' },
        { name: 'fr', title: 'French Status', type: 'string' },
        { name: 'de', title: 'German Status', type: 'string' }
      ]
    },
    {
      name: 'translatedFromHash',
      title: 'Translation Source Hash',
      description: 'SHA hash of English content to detect changes',
      type: 'string'
    }
  ],
  
  // Preview configuration
  preview: {
    select: {
      title: 'title',
      subtitle: 'location.city',
      media: 'coverImage',
      date: 'installationDate'
    },
    prepare(selection) {
      const { title, subtitle, media, date } = selection;
      return {
        title: title,
        subtitle: `${subtitle || 'Location TBD'} - ${date || 'Date TBD'}`,
        media: media
      };
    }
  }
};