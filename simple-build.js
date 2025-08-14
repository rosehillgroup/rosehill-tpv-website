import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting simple English-only build for TPV site');

// Clear and create dist directory
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}

// Create language directories
const langDirs = ['en', 'fr', 'de', 'es'];
langDirs.forEach(lang => {
  const langDir = path.join(distDir, lang);
  fs.mkdirSync(langDir, { recursive: true });
});

// Files and directories to copy to each language directory
const itemsToCopy = [
  // HTML files
  'index.html',
  'products.html', 
  'applications.html',
  'colour.html',
  'about.html',
  'contact.html',
  'installations.html',
  'mixer.html',
  'thank-you.html',
  
  // Asset directories
  'images',
  'Icons', 
  'Blends',
  'favicon_io',
  
  // Installation pages
  'installations',
  
  // Root assets
  'rosehill_tpv_logo.png',
  'rosehill_tpv_logo.webp',
  'favicon.ico',
  'robots.txt',
  '_redirects'
];

// Copy all root image files
const rootFiles = fs.readdirSync(__dirname).filter(file => 
  /\.(jpg|jpeg|png|avif|webp|svg|ico)$/i.test(file)
);

itemsToCopy.push(...rootFiles);

// Copy items to each language directory
langDirs.forEach(lang => {
  const langDir = path.join(distDir, lang);
  
  itemsToCopy.forEach(item => {
    const sourcePath = path.join(__dirname, item);
    const targetPath = path.join(langDir, item);
    
    if (fs.existsSync(sourcePath)) {
      try {
        const stat = fs.statSync(sourcePath);
        if (stat.isDirectory()) {
          fs.cpSync(sourcePath, targetPath, { recursive: true });
          console.log(`✓ Copied directory ${item} to ${lang}/`);
        } else {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`✓ Copied file ${item} to ${lang}/`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to copy ${item}:`, error.message);
      }
    } else {
      console.warn(`⚠️ Source not found: ${item}`);
    }
  });
});

// Copy admin pages to root level (English only)
const adminPages = [
  'installation-approval-hub.html',
  'admin/add-installation.html',
  'installation-parser.js',
  'login.html'
];

adminPages.forEach(adminPage => {
  const sourcePath = path.join(__dirname, adminPage);
  const targetPath = path.join(distDir, adminPage);
  
  if (fs.existsSync(sourcePath)) {
    // Ensure directory exists for nested admin pages
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✓ Copied admin page ${adminPage} to root level`);
  } else {
    console.warn(`⚠️ Admin page not found: ${adminPage}`);
  }
});

// Create root index.html redirect
const rootIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=/en/">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rosehill TPV - Redirecting...</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: #f8f9fa; 
        }
        .loading { 
            color: #1a365d; 
            font-size: 18px; 
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #ff6b35;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loading">
        <div class="spinner"></div>
        <p>Redirecting to Rosehill TPV...</p>
        <p><a href="/en/">Click here if not redirected automatically</a></p>
    </div>
    <script>
        setTimeout(function() {
            window.location.href = '/en/';
        }, 1000);
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), rootIndexHTML);
console.log('✓ Created root index.html redirect');

console.log(`\n✅ Build complete! Created ${langDirs.length} language directories in dist/`);
console.log('📁 Structure created:');
langDirs.forEach(lang => {
  console.log(`   dist/${lang}/`);
});