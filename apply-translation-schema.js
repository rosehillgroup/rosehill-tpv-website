// Apply Translation Schema to Supabase
// This script creates the installation_i18n table and related database objects

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://otidaseqlgubqzsqazqt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4';

/**
 * Execute SQL command via Supabase RPC
 */
async function executeSql(supabase, sql, description) {
    try {
        console.log(`📝 ${description}...`);
        
        // Use the sql function to execute raw SQL
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
        
        if (error) {
            // If the RPC function doesn't exist, try direct SQL execution
            if (error.message.includes('function "exec_sql" does not exist')) {
                console.log('ℹ️  Using alternative SQL execution method...');
                
                // Try using a simple select to test the table creation
                if (sql.includes('CREATE TABLE')) {
                    // For table creation, we'll need to use a different approach
                    throw new Error('Direct SQL execution via Supabase client is limited. Please apply the schema via Supabase Dashboard SQL Editor.');
                }
            }
            throw error;
        }
        
        console.log(`✅ ${description} completed successfully`);
        return data;
        
    } catch (error) {
        console.error(`❌ Error in ${description}:`, error.message);
        throw error;
    }
}

/**
 * Check if table exists
 */
async function checkTableExists(supabase, tableName) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(0);
        
        return !error;
    } catch (error) {
        return false;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('🚀 Applying translation schema to Supabase...\n');
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    try {
        // Check if table already exists
        const tableExists = await checkTableExists(supabase, 'installation_i18n');
        
        if (tableExists) {
            console.log('✅ installation_i18n table already exists');
            
            // Test a simple query
            const { data, error } = await supabase
                .from('installation_i18n')
                .select('*')
                .limit(1);
            
            if (error) {
                console.error('❌ Error accessing table:', error.message);
                return;
            }
            
            console.log('✅ Table is accessible and ready for use');
            console.log(`📊 Current translation records: ${data.length}`);
            return;
        }
        
        // Read the schema file
        const schemaPath = path.join(__dirname, 'supabase-translation-schema.sql');
        
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found: ${schemaPath}`);
        }
        
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('📋 Schema file loaded successfully');
        console.log('📝 Schema contents preview:');
        console.log(schemaSql.substring(0, 200) + '...\n');
        
        // Inform user about manual application
        console.log('⚠️  IMPORTANT: Due to Supabase client limitations, you need to apply this schema manually.');
        console.log('');
        console.log('📋 INSTRUCTIONS:');
        console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
        console.log('2. Navigate to your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Copy and paste the contents of supabase-translation-schema.sql');
        console.log('5. Run the SQL commands');
        console.log('');
        console.log('📄 Schema file location: supabase-translation-schema.sql');
        console.log('');
        console.log('Once applied, you can run the bulk translation script:');
        console.log('node bulk-translate-installations.js');
        
    } catch (error) {
        console.error('\n💥 Schema application failed:', error.message);
        process.exit(1);
    }
}

// Run the schema application
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('\n💥 Unexpected error:', error);
        process.exit(1);
    });
}

export { main };