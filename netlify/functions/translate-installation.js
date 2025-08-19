// Supabase Edge Function for translating installation content
// This function translates installation content using DeepL API and stores in installation_i18n table

import { createClient } from '@supabase/supabase-js';

// DeepL API configuration
const DEEPL_API_KEY = process.env.DEEPL_API_KEY || 'be41df2a-742b-4952-ac1c-f94c17f50a44';
// Use the pro endpoint since the API key appears to be for the paid version
const DEEPL_API_URL = 'https://api.deepl.com/v2/translate';

// Target languages for translation
const TARGET_LANGUAGES = {
  'fr': 'FR',    // French
  'de': 'DE',    // German  
  'es': 'ES',    // Spanish
};

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://otidaseqlgubqzsqazqt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4';

/**
 * Generate a URL-friendly slug from text
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Translate text using DeepL API
 */
async function translateText(text, targetLang) {
  // Handle different types of input
  let textToTranslate = text;
  
  if (!text) {
    return text;
  }
  
  // Convert arrays to string
  if (Array.isArray(text)) {
    textToTranslate = text.join(' ');
  } 
  // Convert objects to string (for JSONB)
  else if (typeof text === 'object') {
    textToTranslate = JSON.stringify(text);
  }
  
  // Convert to string and check if empty
  textToTranslate = String(textToTranslate);
  if (textToTranslate.trim().length === 0) {
    return textToTranslate;
  }

  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'text': textToTranslate,
        'target_lang': targetLang,
        'source_lang': 'EN',
        'formality': 'default',
        'preserve_formatting': 'true'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error(`Translation error for ${targetLang}:`, error);
    throw error;
  }
}

/**
 * Main handler function
 */
export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { installation_id, languages } = JSON.parse(event.body || '{}');

    if (!installation_id) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'installation_id is required' })
      };
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(installation_id)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'installation_id must be a valid UUID' })
      };
    }

    // Default to all languages if none specified
    const targetLangs = languages || Object.keys(TARGET_LANGUAGES);

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Fetch the installation data
    const { data: installation, error: fetchError } = await supabase
      .from('installations')
      .select('id, title, description, location')
      .eq('id', installation_id)
      .single();

    if (fetchError || !installation) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Installation not found' })
      };
    }

    console.log(`Translating installation: ${installation.title}`);

    const results = [];

    // Translate for each target language
    for (const lang of targetLangs) {
      if (!TARGET_LANGUAGES[lang]) {
        console.warn(`Unsupported language: ${lang}`);
        continue;
      }

      try {
        console.log(`Translating to ${lang}...`);

        // Translate each field
        const [translatedTitle, translatedOverview, translatedLocation] = await Promise.all([
          translateText(installation.title, TARGET_LANGUAGES[lang]),
          translateText(installation.description, TARGET_LANGUAGES[lang]),
          translateText(installation.location, TARGET_LANGUAGES[lang])
        ]);

        // Generate slug from translated title
        const translatedSlug = generateSlug(translatedTitle);

        // Insert or update translation in database
        const { data: translationData, error: insertError } = await supabase
          .from('installation_i18n')
          .upsert({
            installation_id: installation.id,
            lang: lang,
            slug: translatedSlug,
            title: translatedTitle,
            overview: translatedOverview,
            location: translatedLocation,
            source: 'mt',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'installation_id,lang'
          });

        if (insertError) {
          console.error(`Error saving translation for ${lang}:`, insertError);
          results.push({
            lang,
            success: false,
            error: insertError.message
          });
        } else {
          console.log(`✓ Successfully translated to ${lang}`);
          results.push({
            lang,
            success: true,
            title: translatedTitle,
            overview: translatedOverview.substring(0, 100) + '...',
            location: translatedLocation,
            slug: translatedSlug
          });
        }

        // Add small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error translating to ${lang}:`, error);
        results.push({
          lang,
          success: false,
          error: error.message
        });
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        installation_id,
        installation_title: installation.title,
        results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      })
    };

  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};