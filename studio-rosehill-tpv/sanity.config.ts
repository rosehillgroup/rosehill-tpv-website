import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemaTypes'

// Supported locales for the site
const supportedLanguages = [
  {id: 'en', title: 'English', isDefault: true},
  {id: 'fr', title: 'French'},
  {id: 'de', title: 'German'},
  {id: 'es', title: 'Spanish'},
]

export default defineConfig({
  name: 'default',
  title: 'Rosehill TPV',

  projectId: '68ola3dd',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages,
      schemaTypes: ['installation'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
