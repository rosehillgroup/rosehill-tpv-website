const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
    // Try to use the same environment variables as the Netlify functions
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set');
    console.log('Supabase Key:', supabaseKey ? 'Set' : 'Not set');
    
    if (!supabaseUrl || !supabaseKey) {
        console.log('\n❌ Environment variables not set. You need to:');
        console.log('1. Set SUPABASE_URL environment variable');
        console.log('2. Set SUPABASE_ANON_KEY environment variable');
        console.log('\nThese should be the same values used in your Netlify environment variables.');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
        console.log('\n🔍 Testing Supabase connection...');
        const { data, error } = await supabase
            .from('installations')
            .select('*')
            .limit(3);
            
        if (error) {
            console.error('❌ Error:', error);
            return;
        }
        
        console.log('✅ Connection successful!');
        console.log(`Found ${data.length} installations in database`);
        
        if (data.length > 0) {
            console.log('\n📋 Sample installation:');
            const sample = data[0];
            console.log('Title:', sample.title);
            console.log('Location:', sample.location);
            console.log('Images:', sample.images);
            console.log('Slug:', sample.slug);
        }
        
    } catch (error) {
        console.error('❌ Error testing Supabase:', error);
    }
}

testSupabase();