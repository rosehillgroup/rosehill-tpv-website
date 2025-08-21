import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId: '68ola3dd',
  dataset: 'production',
  useCdn: true, // Enable CDN for faster reads
  apiVersion: '2023-05-03', // API versioning
})

// TypeScript interfaces for our data
export interface LocalizedString {
  en?: string
  fr?: string
  de?: string
  es?: string
}

export interface LocalizedSlug {
  en?: { _type: 'slug'; current: string }
  fr?: { _type: 'slug'; current: string }
  de?: { _type: 'slug'; current: string }
  es?: { _type: 'slug'; current: string }
}

export interface Location {
  city?: LocalizedString
  country?: LocalizedString
}

export interface ThanksTo {
  company?: string
  url?: string
}

export interface SEO {
  metaTitle?: LocalizedString
  metaDescription?: LocalizedString
}

export interface Installation {
  _id: string
  title?: LocalizedString
  slug?: LocalizedSlug
  overview?: LocalizedString
  location?: Location
  installationDate?: string
  application?: string
  coverImage?: any
  gallery?: any[]
  tags?: string[]
  thanksTo?: ThanksTo
  publishedLocales?: string[]
  translationStatus?: { [key: string]: string }
  seo?: SEO
}

// Helper to get localized content with fallback to English
export function getLocalizedField(field: any, locale: string = 'en'): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[locale] || field.en || ''
}

// Helper specifically for slug fields that have .current property
export function getLocalizedSlug(slug: LocalizedSlug | undefined, locale: string = 'en'): string {
  if (!slug) return ''
  const localeSlug = slug[locale as keyof LocalizedSlug] || slug.en
  return localeSlug?.current || ''
}

// Helper to get all installations for a specific locale
export async function getInstallations(locale: string = 'en'): Promise<Installation[]> {
  const query = `*[_type == "installation" && "${locale}" in publishedLocales] | order(installationDate desc) {
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
    seo
  }`
  
  try {
    return await sanityClient.fetch(query)
  } catch (error) {
    console.warn('No installations found, returning empty array')
    return []
  }
}

// Helper to get a single installation by slug for a specific locale
export async function getInstallationBySlug(slug: string, locale: string = 'en'): Promise<Installation | null> {
  const query = `*[_type == "installation" && slug.${locale}.current == $slug && "${locale}" in publishedLocales][0] {
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
    seo
  }`
  
  try {
    return await sanityClient.fetch(query, {slug})
  } catch (error) {
    console.warn(`Installation not found for slug: ${slug}`)
    return null
  }
}