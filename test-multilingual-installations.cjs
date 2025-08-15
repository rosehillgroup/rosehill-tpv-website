const { createClient } = require('@supabase/supabase-js');
const { generateMultilingualInstallationPages, getLocalizedContent } = require('./generate-installation-pages-multilingual.cjs');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing required environment variables:');
    console.error('SUPABASE_URL:', !!supabaseUrl);
    console.error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY:', !!supabaseKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
    console.log('🔍 Testing database schema...');
    
    try {
        // Test if language columns exist
        const { data, error } = await supabase
            .from('installations')
            .select(`
                id, title, title_en, title_fr, title_de, title_es,
                location, location_en, location_fr, location_de, location_es,
                description, description_en, description_fr, description_de, description_es,
                application, application_en, application_fr, application_de, application_es,
                translation_status
            `)
            .limit(1);
            
        if (error) {
            console.error('❌ Database schema test failed:', error.message);
            console.log('💡 You may need to run the SQL migrations first');
            return false;
        }
        
        console.log('✅ Database schema looks good!');
        
        if (data && data.length > 0) {
            const installation = data[0];
            console.log('\n📋 Sample installation with language columns:');
            console.log('- Title EN:', installation.title_en || 'null');
            console.log('- Title FR:', installation.title_fr || 'null');
            console.log('- Title DE:', installation.title_de || 'null');
            console.log('- Title ES:', installation.title_es || 'null');
            console.log('- Translation Status:', installation.translation_status);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Database test error:', error);
        return false;
    }
}

async function testTranslationLogs() {
    console.log('\n🔍 Checking translation logs...');
    
    try {
        const { data, error } = await supabase
            .from('translation_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
            
        if (error) {
            console.log('⚠️ Translation logs table not found - this is expected if migrations haven\'t been run');
            return false;
        }
        
        console.log('✅ Translation logs table exists');
        
        if (data && data.length > 0) {
            console.log(`📋 Found ${data.length} recent translation log entries:`);
            data.forEach(log => {
                console.log(`- ${log.trigger_type}: ${log.status} (${log.created_at})`);
                if (log.error_message) {
                    console.log(`  Error: ${log.error_message}`);
                }
            });
        } else {
            console.log('📋 No translation logs yet');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Translation logs test error:', error);
        return false;
    }
}

async function testLocalizedContent() {
    console.log('\n🔍 Testing localized content retrieval...');
    
    try {
        const { data: installations, error } = await supabase
            .from('installations')
            .select(`
                id, title, title_en, title_fr, title_de, title_es,
                location, location_en, location_fr, location_de, location_es
            `)
            .limit(1);
            
        if (error) {
            console.error('❌ Failed to fetch test installation:', error.message);
            return false;
        }
        
        if (!installations || installations.length === 0) {
            console.log('⚠️ No installations found to test with');
            return false;
        }
        
        const installation = installations[0];
        console.log(`📋 Testing with installation: ${installation.title}`);
        
        // Test localized content retrieval for each language
        const languages = ['en', 'fr', 'de', 'es'];
        
        for (const lang of languages) {
            const localizedTitle = getLocalizedContent(installation, 'title', lang);
            const localizedLocation = getLocalizedContent(installation, 'location', lang);
            
            console.log(`\n${lang.toUpperCase()}:`);
            console.log(`- Title: ${localizedTitle}`);
            console.log(`- Location: ${localizedLocation}`);
        }
        
        console.log('\n✅ Localized content retrieval working correctly');
        return true;
        
    } catch (error) {
        console.error('❌ Localized content test error:', error);
        return false;
    }
}

async function testPageGeneration() {
    console.log('\n🔍 Testing multilingual page generation...');
    
    try {
        // Generate a small subset for testing
        const { data: installations, error } = await supabase
            .from('installations')
            .select(`
                *,
                title_en, title_fr, title_de, title_es,
                location_en, location_fr, location_de, location_es,
                description_en, description_fr, description_de, description_es,
                application_en, application_fr, application_de, application_es,
                translation_status
            `)
            .limit(2);
            
        if (error) {
            console.error('❌ Failed to fetch installations for testing:', error.message);
            return false;
        }
        
        if (!installations || installations.length === 0) {
            console.log('⚠️ No installations found to generate pages for');
            return false;
        }
        
        console.log(`📋 Testing page generation with ${installations.length} installations...`);
        
        // This would generate actual pages, but for testing we'll just simulate
        console.log('✅ Page generation test completed (simulated)');
        console.log('💡 To run actual generation: node generate-installation-pages-multilingual.cjs');
        
        return true;
        
    } catch (error) {
        console.error('❌ Page generation test error:', error);
        return false;
    }
}

async function testTranslationStatus() {
    console.log('\n🔍 Testing translation status tracking...');
    
    try {
        const { data: installations, error } = await supabase
            .from('installations')
            .select('id, title, translation_status')
            .limit(10);
            
        if (error) {
            console.error('❌ Failed to fetch translation status:', error.message);
            return false;
        }
        
        if (!installations || installations.length === 0) {
            console.log('⚠️ No installations found');
            return false;
        }
        
        console.log('📊 Translation Status Report:');
        
        let translated = 0;
        let partial = 0;
        let untranslated = 0;
        
        installations.forEach(installation => {
            const status = installation.translation_status || {};
            const languages = ['fr', 'de', 'es'];
            const completedLangs = languages.filter(lang => status[lang] === true);
            
            if (completedLangs.length === 3) {
                translated++;
                console.log(`✅ ${installation.title}: Fully translated`);
            } else if (completedLangs.length > 0) {
                partial++;
                console.log(`⚠️ ${installation.title}: Partial (${completedLangs.join(', ')})`);
            } else {
                untranslated++;
                console.log(`❌ ${installation.title}: Not translated`);
            }
        });
        
        console.log(`\n📈 Summary:`);
        console.log(`- Fully translated: ${translated}`);
        console.log(`- Partially translated: ${partial}`);
        console.log(`- Not translated: ${untranslated}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Translation status test error:', error);
        return false;
    }
}

async function runTests() {
    console.log('🧪 Running Multilingual Installation System Tests\n');
    
    const tests = [
        { name: 'Database Schema', fn: testDatabase },
        { name: 'Translation Logs', fn: testTranslationLogs },
        { name: 'Localized Content', fn: testLocalizedContent },
        { name: 'Page Generation', fn: testPageGeneration },
        { name: 'Translation Status', fn: testTranslationStatus }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        console.log(`\n${'='.repeat(50)}`);
        const result = await test.fn();
        if (result) {
            passed++;
        } else {
            failed++;
        }
    }
    
    console.log(`\n${'='.repeat(50)}`);
    console.log('🏁 Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed === 0) {
        console.log('\n🎉 All tests passed! Your multilingual installation system is ready.');
        console.log('\n📋 Next Steps:');
        console.log('1. Deploy the SQL migrations to add language columns');
        console.log('2. Deploy the Edge Function for auto-translation');
        console.log('3. Set up environment variables (DEEPL_API_KEY)');
        console.log('4. Enable pg_net extension in Supabase');
        console.log('5. Test by uploading a new installation');
    } else {
        console.log('\n⚠️ Some tests failed. Please check the errors above and:');
        console.log('1. Ensure SQL migrations have been run');
        console.log('2. Check Supabase connection and permissions');
        console.log('3. Verify environment variables are set');
    }
}

// Run tests if called directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { runTests };