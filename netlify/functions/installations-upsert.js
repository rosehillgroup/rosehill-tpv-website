// Netlify Function: Create or update installation with automatic translation
// Handles English input, translates to ES/FR/DE via DeepL, and saves to Sanity

import crypto from 'crypto';
import { requireEditorRole, checkRateLimit, errorResponse, successResponse, safeLog } from './_utils/auth.js';

/**
 * Generate CORS headers with proper origin handling
 */
function corsHeaders(origin) {
  const allowed = process.env.ALLOWED_ORIGIN || origin || '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type'
  };
}

// DeepL configuration
const DEEPL_API_KEY = process.env.DEEPL_KEY;
const DEEPL_API_URL = 'https://api.deepl.com/v2/translate';

// Brand terms that should not be translated
const PROTECTED_TERMS = [
  'Rosehill TPV',
  'Rosehill Group',
  'Impakt Defender',
  'TPV',
  'Flexilon'
];

/**
 * Generate a unique document ID
 */
function generateDocumentId() {
  return `installation.${crypto.randomUUID()}`;
}

/**
 * Translate text using DeepL with brand protection
 */
async function translateText(text, targetLang, isHtml = false) {
  if (!text || !DEEPL_API_KEY) {
    safeLog('Translation skipped', { reason: 'No text or API key' });
    return null;
  }
  
  try {
    // Protect brand terms by wrapping them
    let protectedText = text;
    const placeholders = {};
    
    PROTECTED_TERMS.forEach((term, index) => {
      const placeholder = `__PROTECTED_${index}__`;
      placeholders[placeholder] = term;
      protectedText = protectedText.replace(new RegExp(term, 'gi'), placeholder);
    });
    
    // Call DeepL API
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        text: protectedText,
        target_lang: targetLang.toUpperCase(),
        source_lang: 'EN',
        preserve_formatting: '1',
        tag_handling: isHtml ? 'html' : undefined
      })
    });
    
    if (!response.ok) {
      throw new Error(`DeepL error: ${response.status}`);
    }
    
    const data = await response.json();
    let translatedText = data.translations[0].text;
    
    // Restore protected terms
    Object.entries(placeholders).forEach(([placeholder, term]) => {
      translatedText = translatedText.replace(new RegExp(placeholder, 'g'), term);
    });
    
    return translatedText;
    
  } catch (error) {
    safeLog('Translation error', { error: error.message, lang: targetLang });
    return null;
  }
}

/**
 * Translate Portable Text blocks
 */
async function translatePortableText(blocks, targetLang) {
  if (!blocks || blocks.length === 0) return null;
  
  try {
    const translatedBlocks = await Promise.all(
      blocks.map(async (block) => {
        if (block._type !== 'block' || !block.children) return block;
        
        // Concatenate all text in the block
        const originalText = block.children
          .map(child => child.text || '')
          .join('');
        
        if (!originalText) return block;
        
        // Translate the text
        const translatedText = await translateText(originalText, targetLang);
        
        if (!translatedText) return null;
        
        // Create new block with translated text
        return {
          _type: 'block',
          _key: block._key || crypto.randomUUID(),
          style: block.style || 'normal',
          children: [{
            _type: 'span',
            _key: crypto.randomUUID(),
            text: translatedText
          }]
        };
      })
    );
    
    return translatedBlocks.filter(block => block !== null);
    
  } catch (error) {
    safeLog('Portable text translation error', { error: error.message });
    return null;
  }
}

/**
 * Generate ALT text if not provided
 */
function generateAltText(title, city, country) {
  const parts = [title, city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(' — ') : 'Installation image';
}

/**
 * Calculate hash of English content for change detection
 */
function calculateContentHash(data) {
  const content = JSON.stringify({
    title: data.title,
    overview: data.overview,
    thanksTo: data.thanksTo,
    location: data.location,
    seo: data.seo
  });
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Main handler
 */
export async function handler(event, context) {
  const headers = corsHeaders(event.headers.origin);
  
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }
  
  safeLog('Upsert installation request', {
    method: event.httpMethod
  });
  
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return errorResponse('Method not allowed', 405, headers);
  }
  
  // Validate authentication
  const auth = await requireEditorRole(event, process.env.ALLOWED_ORIGIN);
  if (!auth.ok) {
    return errorResponse(auth.msg, auth.status, headers);
  }
  
  // Rate limiting
  const rateLimit = checkRateLimit(auth.user.id);
  if (!rateLimit.ok) {
    return errorResponse(
      `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds`,
      429,
      headers
    );
  }
  
  // Parse request body
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return errorResponse('Invalid JSON in request body', 400, headers);
  }
  
  // Validate required fields
  if (!data.title || !data.installationDate || !data.coverAssetId) {
    return errorResponse('Missing required fields: title, installationDate, and coverAssetId are required', 400, headers);
  }
  
  try {
    // Create Sanity client
    const { createClient } = await import('@sanity/client');
    const sanity = createClient({
      projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      token: process.env.SANITY_WRITE_TOKEN,
      useCdn: false
    });
    
    // Generate or validate slug
    let slug = data.slug || data.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 96);
    
    // Update slug collision check to use local sanity client
    async function checkSlugCollisionLocal(slug, excludeId = null) {
      const query = excludeId 
        ? `*[_type == "installation" && slug.current == $slug && _id != $excludeId][0]`
        : `*[_type == "installation" && slug.current == $slug][0]`;
      
      const existing = await sanity.fetch(query, { slug, excludeId });
      return existing !== null;
    }
    
    async function generateUniqueSlugLocal(baseSlug, excludeId = null) {
      let slug = baseSlug;
      let counter = 2;
      
      while (await checkSlugCollisionLocal(slug, excludeId)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      return slug;
    }
    
    // Check for slug collision
    slug = await generateUniqueSlugLocal(slug, data.id);
    
    // Prepare document ID
    const docId = data.id || generateDocumentId();
    const isUpdate = !!data.id;
    
    // Convert overview and thanksTo to Portable Text
    const overviewBlocks = (data.overview || []).map((text, index) => ({
      _type: 'block',
      _key: crypto.randomUUID(),
      style: 'normal',
      children: [{
        _type: 'span',
        _key: crypto.randomUUID(),
        text: text
      }]
    }));
    
    const thanksToBlocks = (data.thanksTo || []).map((text, index) => ({
      _type: 'block',
      _key: crypto.randomUUID(),
      style: 'normal',
      children: [{
        _type: 'span',
        _key: crypto.randomUUID(),
        text: text
      }]
    }));
    
    // Generate ALT text if not provided
    const coverAlt = data.coverAlt || generateAltText(
      data.title,
      data.location?.city,
      data.location?.country
    );
    
    // Prepare English document
    const englishDoc = {
      _id: docId,
      _type: 'installation',
      title: data.title,
      slug: { _type: 'slug', current: slug },
      installationDate: data.installationDate,
      application: data.application || '',
      location: {
        city: data.location?.city || '',
        country: data.location?.country || ''
      },
      overview: overviewBlocks,
      thanksTo: thanksToBlocks,
      coverImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: data.coverAssetId
        },
        alt: coverAlt
      },
      gallery: (data.galleryAssetIds || []).map((assetId, index) => ({
        _type: 'image',
        _key: crypto.randomUUID(),
        asset: {
          _type: 'reference',
          _ref: assetId
        },
        alt: data.galleryAlts?.[index] || coverAlt
      })),
      seo: {
        title: data.seo?.title || data.title,
        description: data.seo?.description || `${data.title} installation in ${data.location?.city}, ${data.location?.country}`
      },
      publishedLocales: ['en'],
      translationStatus: {}
    };
    
    // Calculate content hash for future change detection
    const contentHash = calculateContentHash(englishDoc);
    englishDoc.translatedFromHash = contentHash;
    
    // Create or update English document
    const savedDoc = isUpdate 
      ? await sanity.patch(docId).set(englishDoc).commit()
      : await sanity.create(englishDoc);
    
    safeLog('English document saved', { id: savedDoc._id, slug });
    
    // Translate to other languages
    const languages = ['es', 'fr', 'de'];
    const successfulTranslations = ['en'];
    const translationPatch = {};
    
    for (const lang of languages) {
      try {
        safeLog(`Translating to ${lang}...`);
        
        // Translate all text fields
        const [
          translatedTitle,
          translatedCity,
          translatedCountry,
          translatedSeoTitle,
          translatedSeoDesc,
          translatedCoverAlt
        ] = await Promise.all([
          translateText(data.title, lang),
          translateText(data.location?.city, lang),
          translateText(data.location?.country, lang),
          translateText(data.seo?.title || data.title, lang),
          translateText(data.seo?.description || `${data.title} installation in ${data.location?.city}, ${data.location?.country}`, lang),
          translateText(coverAlt, lang)
        ]);
        
        // Translate Portable Text blocks
        const [translatedOverview, translatedThanks] = await Promise.all([
          translatePortableText(overviewBlocks, lang),
          translatePortableText(thanksToBlocks, lang)
        ]);
        
        // Translate gallery ALTs
        const translatedGalleryAlts = await Promise.all(
          (data.galleryAlts || []).map(alt => translateText(alt || coverAlt, lang))
        );
        
        // Add translations to patch
        if (translatedTitle) translationPatch[`title__${lang}`] = translatedTitle;
        if (translatedCity) translationPatch[`location.city__${lang}`] = translatedCity;
        if (translatedCountry) translationPatch[`location.country__${lang}`] = translatedCountry;
        if (translatedOverview) translationPatch[`overview__${lang}`] = translatedOverview;
        if (translatedThanks) translationPatch[`thanksTo__${lang}`] = translatedThanks;
        if (translatedSeoTitle) translationPatch[`seo.title__${lang}`] = translatedSeoTitle;
        if (translatedSeoDesc) translationPatch[`seo.description__${lang}`] = translatedSeoDesc;
        if (translatedCoverAlt) translationPatch[`coverImage.alt__${lang}`] = translatedCoverAlt;
        
        // Add gallery ALT translations
        translatedGalleryAlts.forEach((alt, index) => {
          if (alt) translationPatch[`gallery[${index}].alt__${lang}`] = alt;
        });
        
        translationPatch[`translationStatus.${lang}`] = 'machine';
        successfulTranslations.push(lang);
        
        safeLog(`Translation to ${lang} completed`);
        
      } catch (error) {
        safeLog(`Translation to ${lang} failed`, { error: error.message });
        translationPatch[`translationStatus.${lang}`] = `error: ${error.message}`;
      }
    }
    
    // Apply translations and update publishedLocales
    translationPatch.publishedLocales = successfulTranslations;
    
    await sanity.patch(docId).set(translationPatch).commit();
    
    safeLog('Installation upserted successfully', {
      id: docId,
      slug,
      locales: successfulTranslations
    });
    
    // Return success with links to view pages
    return successResponse({
      id: docId,
      slug,
      publishedLocales: successfulTranslations,
      viewUrls: {
        en: `/installations/${slug}.html`,
        es: successfulTranslations.includes('es') ? `/es/installations/${slug}.html` : null,
        fr: successfulTranslations.includes('fr') ? `/fr/installations/${slug}.html` : null,
        de: successfulTranslations.includes('de') ? `/de/installations/${slug}.html` : null
      }
    }, 200, headers);
    
  } catch (error) {
    safeLog('Upsert error', { error: error.message });
    return errorResponse('Failed to save installation: ' + error.message, 500, headers);
  }
}