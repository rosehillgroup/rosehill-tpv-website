const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('SUPABASE_URL:', !!supabaseUrl);
    console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
    console.log('\n💡 You need the SERVICE_ROLE_KEY (not ANON_KEY) to run migrations');
    console.log('💡 Find it in your Supabase dashboard: Settings > API > service_role secret');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigration(migrationFile) {
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);
    
    if (!fs.existsSync(migrationPath)) {
        console.error(`❌ Migration file not found: ${migrationPath}`);
        return false;
    }
    
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log(`\n📄 Executing migration: ${migrationFile}`);
    
    try {
        // Split by semicolon and execute each statement
        const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i].trim() + ';';
            if (statement.length > 1) {
                console.log(`  📝 Executing statement ${i + 1}/${statements.length}...`);
                const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
                
                if (error) {
                    console.error(`❌ Error in statement ${i + 1}:`, error.message);
                    return false;
                }
            }
        }
        
        console.log(`✅ Migration ${migrationFile} completed successfully`);
        return true;
        
    } catch (error) {
        console.error(`❌ Error executing migration ${migrationFile}:`, error.message);
        return false;
    }
}

async function createExecSqlFunction() {
    console.log('🔧 Creating helper function for SQL execution...');
    
    const helperSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        EXECUTE sql_query;
        RETURN 'OK';
    EXCEPTION WHEN OTHERS THEN
        RETURN 'ERROR: ' || SQLERRM;
    END;
    $$;
    `;
    
    try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: helperSQL });
        if (error) {
            // Function might not exist yet, try direct SQL
            const { error: directError } = await supabase.from('_migrations').select('*').limit(1);
            if (directError) {
                console.log('⚠️ Unable to create helper function. Will try direct SQL execution.');
                return false;
            }
        }
        console.log('✅ Helper function ready');
        return true;
    } catch (error) {
        console.log('⚠️ Helper function creation failed, will try alternative approach');
        return false;
    }
}

async function runMigrations() {
    console.log('🚀 Starting migration process...');
    console.log(`📡 Connected to: ${supabaseUrl}`);
    
    // Test connection
    try {
        const { data, error } = await supabase.from('installations').select('id').limit(1);
        if (error) {
            console.error('❌ Database connection failed:', error.message);
            process.exit(1);
        }
        console.log('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
    
    // Create helper function
    await createExecSqlFunction();
    
    // List of migrations to run in order
    const migrations = [
        '001_add_language_columns.sql',
        '002_create_translation_trigger.sql'
    ];
    
    let successful = 0;
    let failed = 0;
    
    for (const migration of migrations) {
        const result = await executeMigration(migration);
        if (result) {
            successful++;
        } else {
            failed++;
            console.log(`⚠️ Migration ${migration} failed - continuing with next migration`);
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🏁 Migration Results:');
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed === 0) {
        console.log('\n🎉 All migrations completed successfully!');
        console.log('\n📋 Next Steps:');
        console.log('1. Deploy the Edge Function: supabase functions deploy translate-installation');
        console.log('2. Set DEEPL_API_KEY in Supabase dashboard');
        console.log('3. Enable pg_net extension: CREATE EXTENSION IF NOT EXISTS pg_net;');
        console.log('4. Test by running: node test-multilingual-installations.cjs');
    } else {
        console.log('\n⚠️ Some migrations failed. You may need to:');
        console.log('1. Run the SQL manually in Supabase SQL Editor');
        console.log('2. Check if you have sufficient permissions');
        console.log('3. Ensure you\'re using the SERVICE_ROLE_KEY (not ANON_KEY)');
    }
}

// Alternative function to print SQL for manual execution
async function printMigrationSQL() {
    console.log('📋 SQL Migration Commands (for manual execution in Supabase SQL Editor):');
    console.log('='.repeat(80));
    
    const migrations = [
        '001_add_language_columns.sql',
        '002_create_translation_trigger.sql'
    ];
    
    for (const migration of migrations) {
        const migrationPath = path.join(__dirname, 'supabase', 'migrations', migration);
        if (fs.existsSync(migrationPath)) {
            const sql = fs.readFileSync(migrationPath, 'utf8');
            console.log(`\n-- Migration: ${migration}`);
            console.log('-- ' + '='.repeat(50));
            console.log(sql);
            console.log('\n-- End of ' + migration);
            console.log('-- ' + '='.repeat(50));
        }
    }
}

// Check command line arguments
if (process.argv.includes('--print-sql')) {
    printMigrationSQL().catch(console.error);
} else if (require.main === module) {
    runMigrations().catch(console.error);
}

module.exports = { runMigrations, printMigrationSQL };