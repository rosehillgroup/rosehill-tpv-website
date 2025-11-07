// Working installation save with DeepL translation
const { createClient } = require('@sanity/client');

const crypto = require('crypto');

function corsHeaders(origin) {
  const allowed = process.env.ALLOWED_ORIGIN || origin || '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type'
  };
}

function generateDocumentId() {
  return `installation.${crypto.randomUUID()}`;
}

// DeepL Pro configuration
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api.deepl.com/v2/translate';

console.log('DeepL config check:', {
  hasKey: !!DEEPL_API_KEY,
  keyLength: DEEPL_API_KEY?.length
});

// Simple DeepL translation helper
async function translateText(text, targetLang) {
  if (!text || !DEEPL_API_KEY) return null;
  
  try {
    const params = new URLSearchParams({
      text: text,
      target_lang: targetLang.toUpperCase(),
      source_lang: 'EN'
    });
    
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    
    if (!response.ok) {
      console.error('DeepL error:', response.status, await response.text());
      return null;
    }
    
    const data = await response.json();
    return data.translations[0].text;
    
  } catch (error) {
    console.error('Translation error:', error.message);
    return null;
  }
}

exports.handler = async function(event, context) {
  const headers = corsHeaders(event.headers.origin);
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }
  
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }
  
  // Simple auth check
  const authHeader = event.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { 
      statusCode: 401, 
      headers, 
      body: JSON.stringify({ error: 'Missing authorization' }) 
    };
  }
  
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return { 
      statusCode: 400, 
      headers, 
      body: JSON.stringify({ error: 'Invalid JSON' }) 
    };
  }
  
  if (!data.title || !data.installationDate || !data.coverAssetId) {
    return { 
      statusCode: 400, 
      headers, 
      body: JSON.stringify({ error: 'Missing required fields' }) 
    };
  }
  
  try {
    
    const sanity = createClient({
      projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      token: process.env.SANITY_WRITE_TOKEN,
      useCdn: false
    });
    
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const docId = data.id || generateDocumentId();
    
    // Convert text arrays to Portable Text
    const overviewBlocks = (data.overview || []).map(text => ({
      _type: 'block',
      _key: crypto.randomUUID(),
      style: 'normal',
      children: [{
        _type: 'span',
        _key: crypto.randomUUID(),
        text: text
      }]
    }));
    
    const thanksToBlocks = (data.thanksTo || []).map(text => ({
      _type: 'block',
      _key: crypto.randomUUID(),
      style: 'normal',
      children: [{
        _type: 'span',
        _key: crypto.randomUUID(),
        text: text
      }]
    }));
    
    // Create document with correct flat structure
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
      thanksToUrls: data.thanksToUrls || [],
      coverImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.coverAssetId },
        alt: data.title
      },
      gallery: (data.galleryAssetIds || []).map(assetId => ({
        _type: 'image',
        _key: crypto.randomUUID(),
        asset: { _type: 'reference', _ref: assetId },
        alt: data.title
      })),
      seo: {
        title: data.seo?.title || data.title,
        description: data.seo?.description || `${data.title} installation`
      },
      publishedLocales: ['en'],
      translationStatus: {}
    };
    
    // Save English version first
    const savedDoc = data.id 
      ? await sanity.patch(docId).set(englishDoc).commit()
      : await sanity.create(englishDoc);
    
    console.log('English document saved:', savedDoc._id);
    
    // Translate to other languages
    const languages = ['es', 'fr', 'de'];
    const successfulTranslations = ['en'];
    const translationPatch = {};
    
    for (const lang of languages) {
      try {
        console.log(`Translating to ${lang}...`);
        
        // Translate key fields
        const translatedTitle = await translateText(data.title, lang);
        const translatedCity = await translateText(data.location?.city, lang);
        const translatedCountry = await translateText(data.location?.country, lang);
        
        // Translate overview text (concatenate blocks for translation)
        const overviewText = (data.overview || []).join('\n\n');
        const translatedOverviewText = overviewText ? await translateText(overviewText, lang) : '';
        
        const thanksText = (data.thanksTo || []).join('\n\n');
        const translatedThanksText = thanksText ? await translateText(thanksText, lang) : '';
        
        // Only update if translation succeeded
        if (translatedTitle) {
          translationPatch[`title__${lang}`] = translatedTitle;
          translationPatch[`location.city__${lang}`] = translatedCity || data.location?.city || '';
          translationPatch[`location.country__${lang}`] = translatedCountry || data.location?.country || '';
          
          // Convert translated text back to blocks
          if (translatedOverviewText) {
            const translatedBlocks = translatedOverviewText.split('\n\n').map(text => ({
              _type: 'block',
              _key: crypto.randomUUID(),
              style: 'normal',
              children: [{
                _type: 'span',
                _key: crypto.randomUUID(),
                text: text
              }]
            }));
            translationPatch[`overview__${lang}`] = translatedBlocks;
          }
          
          if (translatedThanksText) {
            const translatedThanksBlocks = translatedThanksText.split('\n\n').map(text => ({
              _type: 'block',
              _key: crypto.randomUUID(),
              style: 'normal',
              children: [{
                _type: 'span',
                _key: crypto.randomUUID(),
                text: text
              }]
            }));
            translationPatch[`thanksTo__${lang}`] = translatedThanksBlocks;
          }
          
          // Copy thanksToUrls for all languages (URLs don't need translation)
          if (data.thanksToUrls && data.thanksToUrls.length > 0) {
            translationPatch[`thanksToUrls__${lang}`] = data.thanksToUrls;
          }
          
          translationPatch[`seo.title__${lang}`] = translatedTitle;
          translationPatch[`seo.description__${lang}`] = `${translatedTitle} installation`;
          translationPatch[`coverImage.alt__${lang}`] = translatedTitle;
          translationPatch[`translationStatus.${lang}`] = 'machine';
          
          successfulTranslations.push(lang);
          console.log(`Translation to ${lang} completed`);
        }
        
      } catch (error) {
        console.error(`Translation to ${lang} failed:`, error.message);
        translationPatch[`translationStatus.${lang}`] = `error: ${error.message}`;
      }
    }
    
    // Update with translations
    if (Object.keys(translationPatch).length > 0) {
      translationPatch.publishedLocales = successfulTranslations;
      await sanity.patch(docId).set(translationPatch).commit();
      console.log('Translations applied:', successfulTranslations);
    }
    
    // Trigger site rebuild to generate installation pages
    try {
      const buildHookUrl = process.env.NETLIFY_BUILD_HOOK;
      if (buildHookUrl) {
        console.log('Triggering site rebuild...');
        const rebuildResponse = await fetch(buildHookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        
        if (rebuildResponse.ok) {
          console.log('Site rebuild triggered successfully');
        } else {
          console.error('Build trigger failed:', rebuildResponse.status);
        }
      } else {
        console.log('NETLIFY_BUILD_HOOK not configured - skipping auto-rebuild');
      }
    } catch (error) {
      console.error('Failed to trigger rebuild:', error.message);
      // Don't fail the whole operation if rebuild trigger fails
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: savedDoc._id,
        slug: slug,
        publishedLocales: successfulTranslations,
        viewUrls: {
          en: `/installations/${slug}.html`,
          es: successfulTranslations.includes('es') ? `/es/installations/${slug}.html` : null,
          fr: successfulTranslations.includes('fr') ? `/fr/installations/${slug}.html` : null,
          de: successfulTranslations.includes('de') ? `/de/installations/${slug}.html` : null
        }
      })
    };
    
  } catch (error) {
    console.error('Save error:', error.message);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: 'Failed to save: ' + error.message }) 
    };
  }
}