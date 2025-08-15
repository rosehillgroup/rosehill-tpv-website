import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TranslationRequest {
  id: string;
  languages?: string[];
}

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

// Supported languages
const SUPPORTED_LANGUAGES = ['fr', 'de', 'es'];
const DEEPL_API_URL = 'https://api.deepl.com/v2/translate';

// Language code mapping (DeepL expects specific formats)
const DEEPL_LANG_MAP: Record<string, string> = {
  'fr': 'FR',
  'de': 'DE', 
  'es': 'ES'
};

async function translateText(text: string, targetLang: string, apiKey: string): Promise<string> {
  if (!text || text.trim().length === 0) {
    return text;
  }

  const deeplLang = DEEPL_LANG_MAP[targetLang];
  if (!deeplLang) {
    throw new Error(`Unsupported language: ${targetLang}`);
  }

  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        target_lang: deeplLang,
        source_lang: 'EN'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DeepL API error (${response.status}):`, errorText);
      throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
    }

    const data: DeepLResponse = await response.json();
    return data.translations[0]?.text || text;
    
  } catch (error) {
    console.error(`Translation failed for language ${targetLang}:`, error);
    // Return original text if translation fails (graceful fallback)
    return text;
  }
}

async function translateDescriptionArray(descriptions: string[], targetLang: string, apiKey: string): Promise<string[]> {
  const translatedDescriptions: string[] = [];
  
  for (const desc of descriptions) {
    const translated = await translateText(desc, targetLang, apiKey);
    translatedDescriptions.push(translated);
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return translatedDescriptions;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const deeplApiKey = Deno.env.get('DEEPL_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    if (!deeplApiKey) {
      console.warn('No DeepL API key found - translations will be skipped');
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const requestBody: TranslationRequest = await req.json();
    const { id, languages = SUPPORTED_LANGUAGES } = requestBody;

    if (!id) {
      throw new Error('Installation ID is required');
    }

    console.log(`Starting translation for installation: ${id}`);

    // Fetch the installation record
    const { data: installation, error: fetchError } = await supabase
      .from('installations')
      .select('title, location, description, application, title_en, location_en, description_en, application_en')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch installation: ${fetchError.message}`);
    }

    if (!installation) {
      throw new Error(`Installation not found: ${id}`);
    }

    // Use English columns as source, fallback to original columns
    const sourceTitle = installation.title_en || installation.title;
    const sourceLocation = installation.location_en || installation.location;
    const sourceDescription = installation.description_en || installation.description;
    const sourceApplication = installation.application_en || installation.application;

    console.log(`Source content loaded for: ${sourceTitle}`);

    // Skip translation if no DeepL API key
    if (!deeplApiKey) {
      console.log('No DeepL API key - skipping translation but updating English columns');
      
      // Update English columns with source data
      const { error: updateError } = await supabase
        .from('installations')
        .update({
          title_en: sourceTitle,
          location_en: sourceLocation,
          description_en: sourceDescription,
          application_en: sourceApplication,
        })
        .eq('id', id);

      if (updateError) {
        throw new Error(`Failed to update English columns: ${updateError.message}`);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'English columns updated. Translation skipped (no API key)',
          id: id 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Prepare update object
    const updateData: Record<string, any> = {
      // Ensure English columns are populated
      title_en: sourceTitle,
      location_en: sourceLocation,
      description_en: sourceDescription,
      application_en: sourceApplication,
    };

    // Translate to each target language
    for (const lang of languages) {
      if (!SUPPORTED_LANGUAGES.includes(lang)) {
        console.warn(`Skipping unsupported language: ${lang}`);
        continue;
      }

      try {
        console.log(`Translating to ${lang}...`);

        // Translate individual fields
        const translatedTitle = await translateText(sourceTitle, lang, deeplApiKey);
        const translatedLocation = await translateText(sourceLocation, lang, deeplApiKey);
        const translatedApplication = await translateText(sourceApplication, lang, deeplApiKey);
        
        // Translate description array
        const translatedDescription = Array.isArray(sourceDescription) 
          ? await translateDescriptionArray(sourceDescription, lang, deeplApiKey)
          : [await translateText(sourceDescription?.toString() || '', lang, deeplApiKey)];

        // Add to update data
        updateData[`title_${lang}`] = translatedTitle;
        updateData[`location_${lang}`] = translatedLocation;
        updateData[`description_${lang}`] = translatedDescription;
        updateData[`application_${lang}`] = translatedApplication;

        console.log(`✓ Translation completed for ${lang}`);

      } catch (error) {
        console.error(`Translation failed for ${lang}:`, error);
        // Continue with other languages even if one fails
      }
    }

    // Update the database with all translations
    const { error: updateError } = await supabase
      .from('installations')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      throw new Error(`Failed to update translations: ${updateError.message}`);
    }

    console.log(`✅ Translation completed for installation: ${sourceTitle}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Translation completed for languages: ${languages.join(', ')}`,
        id: id,
        title: sourceTitle,
        translatedLanguages: languages
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Translation function error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});