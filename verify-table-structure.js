// Verify Supabase Table Structure
// This script checks the existing installations table structure

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://otidaseqlgubqzsqazqt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4';

async function main() {
    console.log('🔍 Verifying Supabase table structure...\n');
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    try {
        // Get sample installation data to check ID format
        console.log('📋 Checking installations table...');
        const { data: installations, error: installError } = await supabase
            .from('installations')
            .select('id, title, slug')
            .limit(3);
        
        if (installError) {
            console.error('❌ Error fetching installations:', installError.message);
            return;
        }
        
        if (!installations || installations.length === 0) {
            console.log('⚠️  No installations found in database');
            return;
        }
        
        console.log('✅ Sample installations:');
        installations.forEach((inst, index) => {
            console.log(`   ${index + 1}. ID: ${inst.id} (type: ${typeof inst.id}, length: ${inst.id.length})`);
            console.log(`      Title: ${inst.title}`);
            console.log(`      Slug: ${inst.slug}`);
            
            // Check if it's a UUID
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            const isUUID = uuidRegex.test(inst.id);
            console.log(`      Is UUID: ${isUUID ? '✅' : '❌'}`);
            console.log('');
        });
        
        // Check if translation table exists
        console.log('🔍 Checking translation table...');
        const { data: translations, error: transError } = await supabase
            .from('installation_i18n')
            .select('*')
            .limit(1);
        
        if (transError) {
            if (transError.message.includes('does not exist')) {
                console.log('❌ Translation table does not exist yet - this is expected before applying schema');
            } else {
                console.error('❌ Translation table error:', transError.message);
            }
        } else {
            console.log('✅ Translation table exists and is accessible');
            console.log(`📊 Sample translations found: ${translations.length}`);
        }
        
        // Generate corrected schema snippet
        const sampleId = installations[0].id;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sampleId);
        
        console.log('\n' + '='.repeat(60));
        console.log('📝 RECOMMENDED SCHEMA CONFIGURATION');
        console.log('='.repeat(60));
        
        if (isUUID) {
            console.log('✅ Your installations table uses UUID for id field');
            console.log('✅ The updated schema (installation_id UUID) is correct');
        } else {
            console.log('⚠️  Your installations table uses INTEGER for id field');
            console.log('🔧 You should use: installation_id INTEGER NOT NULL');
        }
        
        console.log('\n📋 Copy the updated supabase-translation-schema.sql to Supabase SQL Editor');
        
    } catch (error) {
        console.error('💥 Verification failed:', error.message);
        process.exit(1);
    }
}

main();