import {defineType, defineField} from 'sanity'

// Supported locales
const supportedLanguages = [
  {id: 'en', title: 'English', isDefault: true},
  {id: 'fr', title: 'French'},
  {id: 'de', title: 'German'},
  {id: 'es', title: 'Spanish'},
]

// Helper function to create localized fields
const localizeField = (field: any) => ({
  ...field,
  type: 'object',
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: field.type,
    ...field,
    fieldset: lang.isDefault ? undefined : 'translations',
  })),
})

export const installation = defineType({
  name: 'installation',
  title: 'Installation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      ...localizeField({
        type: 'string',
        validation: (rule: any) => rule.required(),
      }),
    }),
    
    defineField({
      name: 'slug',
      title: 'Slug',
      ...localizeField({
        type: 'slug',
        options: {
          source: 'title.en', // Generate from English title
          maxLength: 96,
        },
        validation: (rule: any) => rule.required(),
      }),
    }),

    defineField({
      name: 'overview',
      title: 'Project Overview',
      ...localizeField({
        type: 'text',
        rows: 4,
        validation: (rule: any) => rule.required(),
      }),
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        {
          name: 'city',
          title: 'City',
          ...localizeField({
            type: 'string',
          }),
        },
        {
          name: 'country',
          title: 'Country',
          ...localizeField({
            type: 'string',
          }),
        },
        {
          name: 'coordinates',
          title: 'Coordinates',
          type: 'geopoint',
        },
      ],
    }),

    defineField({
      name: 'installationDate',
      title: 'Installation Date',
      type: 'date',
      validation: (rule: any) => rule.required(),
    }),

    defineField({
      name: 'application',
      title: 'Application',
      type: 'string',
      options: {
        list: [
          {title: 'Playground', value: 'playground'},
          {title: 'Sports Court', value: 'sports-court'},
          {title: 'Fitness Area', value: 'fitness'},
          {title: 'Water Park', value: 'water-park'},
          {title: 'Track & Field', value: 'track-field'},
          {title: 'Pool Surround', value: 'pool-surround'},
        ],
      },
      validation: (rule: any) => rule.required(),
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          ...localizeField({
            type: 'string',
          }),
        },
      ],
    }),

    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              ...localizeField({
                type: 'string',
              }),
            },
            {
              name: 'caption',
              title: 'Caption',
              ...localizeField({
                type: 'string',
              }),
            },
          ],
        },
      ],
    }),

    // Additional image reference fields for admin interface
    defineField({
      name: 'imageReferences',
      title: 'Image References',
      description: 'Array of image file paths for legacy installations',
      type: 'array',
      of: [{type: 'string'}],
    }),

    defineField({
      name: 'imageCount',
      title: 'Image Count',
      description: 'Total number of images for this installation',
      type: 'number',
    }),

    defineField({
      name: 'coverImagePath',
      title: 'Cover Image Path',
      description: 'Path to the main cover image file',
      type: 'string',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),

    defineField({
      name: 'thanksTo',
      title: 'Thanks To',
      type: 'object',
      fields: [
        {
          name: 'company',
          title: 'Company Name',
          type: 'string',
        },
        {
          name: 'url',
          title: 'Company URL',
          type: 'url',
        },
      ],
    }),

    defineField({
      name: 'publishedLocales',
      title: 'Published Locales',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: supportedLanguages.map((lang) => ({
              title: lang.title,
              value: lang.id,
            })),
          },
        },
      ],
      initialValue: ['en'],
    }),

    defineField({
      name: 'translationStatus',
      title: 'Translation Status',
      type: 'object',
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: 'string',
        options: {
          list: [
            {title: 'Not Started', value: 'not-started'},
            {title: 'Machine Translated', value: 'machine-translated'},
            {title: 'Human Reviewed', value: 'human-reviewed'},
            {title: 'Published', value: 'published'},
          ],
        },
        initialValue: lang.isDefault ? 'published' : 'not-started',
      })),
    }),

    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          ...localizeField({
            type: 'string',
            validation: (rule: any) => rule.max(60),
          }),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          ...localizeField({
            type: 'text',
            validation: (rule: any) => rule.max(160),
          }),
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title.en',
      location: 'location.city.en',
      media: 'coverImage',
      date: 'installationDate',
    },
    prepare({title, location, media, date}) {
      return {
        title: title || 'Untitled Installation',
        subtitle: `${location || 'Unknown Location'} - ${date || 'No Date'}`,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Installation Date (Newest First)',
      name: 'installationDateDesc',
      by: [{field: 'installationDate', direction: 'desc'}],
    },
    {
      title: 'Installation Date (Oldest First)', 
      name: 'installationDateAsc',
      by: [{field: 'installationDate', direction: 'asc'}],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{field: 'title.en', direction: 'asc'}],
    },
  ],
})