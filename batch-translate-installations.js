#!/usr/bin/env node

/**
 * Batch Translation Script for Rosehill TPV Installations
 * 
 * Translates all existing installations missing translations using the 
 * translate-installation Edge Function. Includes error handling, progress 
 * tracking, and rate limiting.
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

// Configuration
const CONFIG = {
    SUPABASE_URL: process.env.SUPABASE_URL || 'https://otidaseqlgubqzsqazqt.supabase.co',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4',
    TARGET_LANGS: ['fr', 'de', 'es'],
    FIELDS_TO_CHECK: ['title', 'location', 'description', 'application'],
    DELAY_BETWEEN_CALLS: 1000, // 1 second between calls
    MAX_RETRIES: 3,
    RETRY_DELAY: 5000, // 5 seconds between retries
    PROGRESS_FILE: './translation-progress.json',
    DRY_RUN: process.argv.includes('--dry-run')
};

// Progress tracking
let progressState = {
    totalToTranslate: 0,
    completed: [],
    failed: [],
    skipped: [],
    startTime: null,
    lastProcessedId: null
};

/**
 * Load progress state from file
 */
async function loadProgress() {
    try {
        const data = await fs.readFile(CONFIG.PROGRESS_FILE, 'utf8');
        progressState = { ...progressState, ...JSON.parse(data) };
        console.log(`📂 Loaded progress state: ${progressState.completed.length} completed, ${progressState.failed.length} failed`);
    } catch (error) {
        console.log('📂 No existing progress file found, starting fresh');
    }
}

/**
 * Save progress state to file
 */
async function saveProgress() {
    try {
        await fs.writeFile(CONFIG.PROGRESS_FILE, JSON.stringify(progressState, null, 2));
    } catch (error) {
        console.error('❌ Failed to save progress:', error.message);
    }
}

/**
 * Check if installation is missing any translations
 */
function isMissingTranslations(installation) {
    for (const lang of CONFIG.TARGET_LANGS) {
        for (const field of CONFIG.FIELDS_TO_CHECK) {
            const fieldName = `${field}_${lang}`;
            if (!installation[fieldName] || installation[fieldName] === null) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Get missing translation details for an installation
 */
function getMissingTranslations(installation) {
    const missing = {};
    for (const lang of CONFIG.TARGET_LANGS) {
        missing[lang] = [];
        for (const field of CONFIG.FIELDS_TO_CHECK) {
            const fieldName = `${field}_${lang}`;
            if (!installation[fieldName] || installation[fieldName] === null) {
                missing[lang].push(field);
            }
        }
        if (missing[lang].length === 0) {
            delete missing[lang];
        }
    }
    return missing;
}

/**
 * Fetch installations that need translation
 */
async function getUntranslatedInstallations() {
    console.log('🔍 Fetching installations from Supabase...');
    
    // Build select query with all language-specific fields
    const selectFields = [
        'id', 'title', 'slug',
        ...CONFIG.TARGET_LANGS.flatMap(lang => 
            CONFIG.FIELDS_TO_CHECK.map(field => `${field}_${lang}`)
        )
    ].join(',');

    const url = `${CONFIG.SUPABASE_URL}/rest/v1/installations?select=${selectFields}&order=installation_date.desc`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'apikey': CONFIG.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const installations = await response.json();
        console.log(`📊 Found ${installations.length} total installations`);

        // Filter to only those missing translations
        const untranslated = installations.filter(installation => {
            // Skip if already processed
            if (progressState.completed.includes(installation.id) || 
                progressState.skipped.includes(installation.id)) {
                return false;
            }
            return isMissingTranslations(installation);
        });

        console.log(`🔤 ${untranslated.length} installations need translation`);
        
        // Show detailed breakdown
        if (untranslated.length > 0) {
            console.log('\n📋 Translation breakdown:');
            untranslated.slice(0, 5).forEach(installation => {
                const missing = getMissingTranslations(installation);
                const missingSummary = Object.entries(missing)
                    .map(([lang, fields]) => `${lang}: ${fields.join(', ')}`)
                    .join('; ');
                console.log(`   • ${installation.title || installation.slug}: ${missingSummary}`);
            });
            if (untranslated.length > 5) {
                console.log(`   ... and ${untranslated.length - 5} more`);
            }
        }

        return untranslated;
    } catch (error) {
        console.error('❌ Failed to fetch installations:', error.message);
        throw error;
    }
}

/**
 * Translate a single installation with retry logic
 */
async function translateInstallation(installation, attempt = 1) {
    const edgeFunctionUrl = `${CONFIG.SUPABASE_URL}/functions/v1/translate-installation`;
    
    try {
        console.log(`🔄 Translating "${installation.title || installation.slug}" (attempt ${attempt}/${CONFIG.MAX_RETRIES})`);
        
        if (CONFIG.DRY_RUN) {
            console.log(`   🧪 DRY RUN: Would call Edge Function for ID ${installation.id}`);
            return { success: true, dryRun: true };
        }

        const response = await fetch(edgeFunctionUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
                'apikey': CONFIG.SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                id: installation.id,
                languages: CONFIG.TARGET_LANGS 
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log(`   ✅ Translation completed: ${result.message || 'Success'}`);
        
        return { success: true, result };

    } catch (error) {
        console.error(`   ❌ Translation failed (attempt ${attempt}): ${error.message}`);
        
        if (attempt < CONFIG.MAX_RETRIES) {
            console.log(`   ⏳ Retrying in ${CONFIG.RETRY_DELAY / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
            return translateInstallation(installation, attempt + 1);
        } else {
            console.error(`   💥 Max retries exceeded for "${installation.title || installation.slug}"`);
            return { success: false, error: error.message };
        }
    }
}

/**
 * Process all untranslated installations
 */
async function processTranslations(installations) {
    console.log(`\n🚀 ${CONFIG.DRY_RUN ? 'DRY RUN: ' : ''}Starting translation process for ${installations.length} installations`);
    
    progressState.totalToTranslate = installations.length;
    progressState.startTime = new Date().toISOString();
    
    let successCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < installations.length; i++) {
        const installation = installations[i];
        const progress = `[${i + 1}/${installations.length}]`;
        
        console.log(`\n${progress} Processing: ${installation.title || installation.slug}`);
        
        // Show what's missing for this installation
        const missing = getMissingTranslations(installation);
        const missingSummary = Object.entries(missing)
            .map(([lang, fields]) => `${lang}: ${fields.join(', ')}`)
            .join('; ');
        console.log(`   Missing: ${missingSummary}`);

        const translationResult = await translateInstallation(installation);
        
        if (translationResult.success) {
            progressState.completed.push(installation.id);
            progressState.lastProcessedId = installation.id;
            successCount++;
            
            if (translationResult.dryRun) {
                console.log(`   🧪 DRY RUN: Would have translated installation`);
            }
        } else {
            progressState.failed.push({
                id: installation.id,
                title: installation.title || installation.slug,
                error: translationResult.error,
                timestamp: new Date().toISOString()
            });
            failedCount++;
        }

        // Save progress after each installation
        await saveProgress();

        // Rate limiting delay (except for last item)
        if (i < installations.length - 1) {
            console.log(`   ⏳ Waiting ${CONFIG.DELAY_BETWEEN_CALLS}ms before next translation...`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_CALLS));
        }
    }

    // Final summary
    console.log(`\n🎉 Translation batch ${CONFIG.DRY_RUN ? 'simulation ' : ''}complete!`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    
    if (failedCount > 0) {
        console.log('\n❌ Failed installations:');
        progressState.failed.forEach(failure => {
            console.log(`   • ${failure.title}: ${failure.error}`);
        });
    }

    return { successCount, failedCount, skippedCount };
}

/**
 * Main execution function
 */
async function main() {
    console.log('🌍 Rosehill TPV Batch Translation Tool');
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log(`🎯 Target languages: ${CONFIG.TARGET_LANGS.join(', ')}`);
    console.log(`⚙️  Mode: ${CONFIG.DRY_RUN ? 'DRY RUN (no actual translations)' : 'LIVE TRANSLATION'}`);
    
    try {
        // Load any existing progress
        await loadProgress();
        
        // Fetch installations that need translation
        const untranslatedInstallations = await getUntranslatedInstallations();
        
        if (untranslatedInstallations.length === 0) {
            console.log('🎉 All installations are already translated!');
            return;
        }

        // Confirm before proceeding (unless dry run)
        if (!CONFIG.DRY_RUN) {
            console.log(`\n⚠️  About to translate ${untranslatedInstallations.length} installations.`);
            console.log('   This will make actual API calls to DeepL and update your database.');
            console.log('   Run with --dry-run flag to test without making changes.');
            console.log('\n   Press Ctrl+C to cancel, or wait 5 seconds to continue...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        // Process all translations
        const results = await processTranslations(untranslatedInstallations);
        
        // Clean up progress file on successful completion
        if (results.failedCount === 0 && !CONFIG.DRY_RUN) {
            try {
                await fs.unlink(CONFIG.PROGRESS_FILE);
                console.log('🧹 Cleaned up progress file');
            } catch (error) {
                // File might not exist, ignore
            }
        }

        console.log('\n🏁 Batch translation completed successfully!');
        
    } catch (error) {
        console.error('\n💥 Fatal error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n\n🛑 Received interrupt signal. Saving progress...');
    await saveProgress();
    console.log('💾 Progress saved. You can resume later by running the script again.');
    process.exit(0);
});

// Run the script
const isMainModule = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMainModule || process.argv[1]?.endsWith('batch-translate-installations.js')) {
    main().catch(console.error);
}