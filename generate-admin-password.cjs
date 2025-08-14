const bcrypt = require('bcryptjs');

// Get password from command line argument
const password = process.argv[2];

if (!password) {
    console.log('Usage: node generate-admin-password.js "your-password-here"');
    console.log('Example: node generate-admin-password.js "MySecurePassword123"');
    process.exit(1);
}

// Generate hash with salt rounds of 10 (same as current system)
bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error generating hash:', err);
        process.exit(1);
    }
    
    console.log('\n🔐 Password Hash Generated:');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n📝 Instructions:');
    console.log('1. Copy the hash above');
    console.log('2. Go to Netlify Dashboard → Site Settings → Environment Variables');
    console.log('3. Update ADMIN_PASSWORD_HASH with the new hash');
    console.log('4. Redeploy your site (or wait for automatic deployment)');
    console.log('5. Use the password above to log into admin');
});