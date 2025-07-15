#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Import the optimized page generation functions
const { generateInstallationPages } = require('./generate-installation-pages-supabase');

/**
 * Automatically regenerate installation pages after new installation is added
 * This script should be called after a new installation is added via the admin form
 */

async function autoRegenerateInstallationPages() {
    console.log('🔄 Auto-regenerating installation pages with optimized images...');
    
    try {
        // Call the updated generation function with optimization
        await generateInstallationPages();
        
        console.log('✅ Installation pages regenerated successfully!');
        console.log('All new Supabase images will now use optimized transformations');
        
        return {
            success: true,
            message: 'Installation pages regenerated with optimized images'
        };
        
    } catch (error) {
        console.error('❌ Error regenerating installation pages:', error);
        
        return {
            success: false,
            error: error.message
        };
    }
}

// Export for use in Netlify functions
module.exports = { autoRegenerateInstallationPages };

// Run if called directly
if (require.main === module) {
    autoRegenerateInstallationPages()
        .then(result => {
            if (result.success) {
                console.log('Script completed successfully');
                process.exit(0);
            } else {
                console.error('Script failed:', result.error);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('Unexpected error:', error);
            process.exit(1);
        });
}