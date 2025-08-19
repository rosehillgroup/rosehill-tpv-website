// Bulk Translation Migration Script
// This script translates all existing installations in the database
// to French, German, and Spanish using the Netlify Edge Function

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://otidaseqlgubqzsqazqt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4';

// Target languages for translation
const TARGET_LANGUAGES = ['fr', 'de', 'es'];

// Rate limiting configuration
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
const BATCH_SIZE = 5; // Process 5 installations at a time
const RETRY_ATTEMPTS = 3;

/**
 * Sleep function for rate limiting
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Call the Netlify Edge Function to translate an installation
 */
async function translateInstallation(installationId, retryCount = 0) {
    try {
        console.log(`\n📝 Translating installation ID: ${installationId}`);
        
        const response = await fetch('https://tpv-2025-deploy.netlify.app/.netlify/functions/translate-installation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                installation_id: installationId.toString(),
                languages: TARGET_LANGUAGES
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        
        // Log summary
        console.log(`✅ Translation completed for installation ${installationId}:`);
        console.log(`   - Title: ${result.installation_title}`);
        console.log(`   - Languages: ${result.results.map(r => r.lang).join(', ')}`);
        console.log(`   - Success: ${result.summary.successful}/${result.summary.total}`);
        
        if (result.summary.failed > 0) {
            console.log(`   - Failed: ${result.summary.failed}`);
            result.results.forEach(r => {
                if (!r.success) {
                    console.log(`     ❌ ${r.lang}: ${r.error}`);
                }
            });
        }

        return result;

    } catch (error) {
        console.error(`❌ Error translating installation ${installationId}:`, error.message);
        
        if (retryCount < RETRY_ATTEMPTS) {
            console.log(`🔄 Retrying... (attempt ${retryCount + 1}/${RETRY_ATTEMPTS})`);
            await sleep(RATE_LIMIT_DELAY * 2); // Longer delay for retry
            return translateInstallation(installationId, retryCount + 1);
        } else {
            console.error(`💥 Failed to translate installation ${installationId} after ${RETRY_ATTEMPTS} attempts`);
            return {
                installation_id: installationId,
                success: false,
                error: error.message
            };
        }
    }
}

/**
 * Process installations in batches
 */
async function processBatch(installations, batchIndex, totalBatches) {
    console.log(`\n🚀 Processing batch ${batchIndex + 1}/${totalBatches} (${installations.length} installations)`);
    
    const results = [];
    
    for (let i = 0; i < installations.length; i++) {
        const installation = installations[i];
        
        console.log(`\n📋 Progress: ${i + 1}/${installations.length} in current batch`);
        console.log(`🏗️  Installation: "${installation.title}" (ID: ${installation.id})`);
        
        const result = await translateInstallation(installation.id);
        results.push(result);
        
        // Rate limiting - wait between requests
        if (i < installations.length - 1) {
            console.log(`⏳ Waiting ${RATE_LIMIT_DELAY}ms before next translation...`);
            await sleep(RATE_LIMIT_DELAY);
        }
    }
    
    return results;
}

/**
 * Check if installation already has translations
 */
async function checkExistingTranslations(supabase, installationId) {
    const { data, error } = await supabase
        .from('installation_i18n')
        .select('lang')
        .eq('installation_id', installationId);
    
    if (error) {
        console.warn(`Warning: Could not check existing translations for ${installationId}:`, error.message);
        return [];
    }
    
    return data ? data.map(t => t.lang) : [];
}

/**
 * Generate progress report
 */
function generateReport(allResults, totalInstallations, startTime) {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 BULK TRANSLATION REPORT');
    console.log('='.repeat(60));
    
    console.log(`⏱️  Duration: ${Math.floor(duration / 60)}m ${duration % 60}s`);
    console.log(`📝 Total installations processed: ${totalInstallations}`);
    
    const successful = allResults.filter(r => r.success !== false).length;
    const failed = allResults.filter(r => r.success === false).length;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed > 0) {
        console.log('\n❌ Failed installations:');
        allResults.filter(r => r.success === false).forEach(r => {
            console.log(`   - ID ${r.installation_id}: ${r.error}`);
        });
    }
    
    // Count translations by language
    const langStats = {};
    TARGET_LANGUAGES.forEach(lang => langStats[lang] = 0);
    
    allResults.forEach(result => {
        if (result.results) {
            result.results.forEach(r => {
                if (r.success) {
                    langStats[r.lang]++;
                }
            });
        }
    });
    
    console.log('\n🌍 Translations by language:');
    Object.entries(langStats).forEach(([lang, count]) => {
        const langName = {fr: 'French', de: 'German', es: 'Spanish'}[lang];
        console.log(`   - ${langName} (${lang}): ${count}`);
    });
    
    console.log('\n✨ Translation migration completed!');
    console.log('='.repeat(60));
}

/**
 * Main function
 */
async function main() {
    console.log('🚀 Starting bulk translation migration...\n');
    console.log(`📊 Configuration:`);
    console.log(`   - Target languages: ${TARGET_LANGUAGES.join(', ')}`);
    console.log(`   - Batch size: ${BATCH_SIZE}`);
    console.log(`   - Rate limit delay: ${RATE_LIMIT_DELAY}ms`);
    console.log(`   - Max retry attempts: ${RETRY_ATTEMPTS}`);
    
    const startTime = new Date();
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    try {
        // Fetch all installations
        console.log('\n📋 Fetching installations from database...');
        const { data: installations, error } = await supabase
            .from('installations')
            .select('id, title, location')
            .order('installation_date', { ascending: false });
        
        if (error) {
            throw new Error(`Failed to fetch installations: ${error.message}`);
        }
        
        if (!installations || installations.length === 0) {
            console.log('❌ No installations found in database');
            return;
        }
        
        console.log(`✅ Found ${installations.length} installations`);
        
        // Check for existing translations
        console.log('\n🔍 Checking for existing translations...');
        const installationsToTranslate = [];
        
        for (const installation of installations) {
            const existingLangs = await checkExistingTranslations(supabase, installation.id);
            const missingLangs = TARGET_LANGUAGES.filter(lang => !existingLangs.includes(lang));
            
            if (missingLangs.length > 0) {
                installationsToTranslate.push({
                    ...installation,
                    missingLangs
                });
                console.log(`   📝 "${installation.title}" - missing: ${missingLangs.join(', ')}`);
            } else {
                console.log(`   ✅ "${installation.title}" - already translated`);
            }
        }
        
        if (installationsToTranslate.length === 0) {
            console.log('\n🎉 All installations are already translated!');
            return;
        }
        
        console.log(`\n📊 Summary: ${installationsToTranslate.length} installations need translation`);
        
        // Process in batches
        const batches = [];
        for (let i = 0; i < installationsToTranslate.length; i += BATCH_SIZE) {
            batches.push(installationsToTranslate.slice(i, i + BATCH_SIZE));
        }
        
        console.log(`\n🔄 Processing ${batches.length} batches...`);
        
        const allResults = [];
        
        for (let i = 0; i < batches.length; i++) {
            const batchResults = await processBatch(batches[i], i, batches.length);
            allResults.push(...batchResults);
            
            // Longer pause between batches
            if (i < batches.length - 1) {
                console.log(`\n⏸️  Batch completed. Waiting 5 seconds before next batch...`);
                await sleep(5000);
            }
        }
        
        // Generate final report
        generateReport(allResults, installationsToTranslate.length, startTime);
        
    } catch (error) {
        console.error('\n💥 Migration failed:', error.message);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Migration interrupted by user');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n🛑 Migration terminated');
    process.exit(0);
});

// Run the migration
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('\n💥 Unexpected error:', error);
        process.exit(1);
    });
}

export { main };