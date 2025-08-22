#!/usr/bin/env node

// Enhanced script to build complete image mapping for ALL installations
import fs from 'fs';
import path from 'path';

const installationsDir = './installations';
const imagesDir = './images/installations';

// Function to extract images from HTML content
function extractImagesFromHTML(htmlContent, filename) {
  const images = new Set();
  
  // Look for img tags with src pointing to images/installations/
  const imgRegex = /<img[^>]*src=["']([^"']*(?:images\/installations\/|\.\.\/images\/installations\/)[^"']*)["'][^>]*>/gi;
  let match;
  
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    let imgPath = match[1];
    // Clean up the path
    imgPath = imgPath.replace(/.*images\/installations\//, '');
    // Remove query parameters (width, height, etc.)
    imgPath = imgPath.split('?')[0];
    if (imgPath && !imgPath.includes('placeholder')) {
      images.add(imgPath);
    }
  }
  
  // Look for background-image CSS properties
  const bgImgRegex = /background-image:\s*url\(['"]?([^'")]*(?:images\/installations\/|\.\.\/images\/installations\/)[^'")]*)['"]?\)/gi;
  while ((match = bgImgRegex.exec(htmlContent)) !== null) {
    let imgPath = match[1];
    imgPath = imgPath.replace(/.*images\/installations\//, '');
    imgPath = imgPath.split('?')[0];
    if (imgPath && !imgPath.includes('placeholder')) {
      images.add(imgPath);
    }
  }
  
  // If no images found, try to infer from filename patterns
  if (images.size === 0) {
    const inferredImages = inferImagesFromFilename(filename);
    inferredImages.forEach(img => images.add(img));
  }
  
  return Array.from(images);
}

// Function to infer images from installation filename patterns
function inferImagesFromFilename(filename) {
  const images = [];
  const availableImages = fs.readdirSync(imagesDir).filter(f => 
    f.match(/\.(jpg|jpeg|png|webp|avif)$/i) && !f.includes('placeholder')
  );
  
  // Extract key terms from filename
  const cleanName = filename
    .replace(/\.html$/, '')
    .replace(/\d+-/g, '') // Remove timestamps
    .replace(/-/g, ' ')
    .toLowerCase();
  
  // Look for direct name matches
  const nameWords = cleanName.split(' ').filter(w => w.length > 3);
  
  for (const img of availableImages) {
    const imgName = img.toLowerCase().replace(/[-_.]/g, ' ');
    
    // Check if image name contains key words from installation
    const matches = nameWords.filter(word => imgName.includes(word));
    if (matches.length >= 2) {
      images.push(img);
    }
    
    // Special pattern matching
    if (cleanName.includes('basketball') && imgName.includes('basketball')) {
      images.push(img);
    }
    if (cleanName.includes('playground') && imgName.includes('playground')) {
      images.push(img);
    }
    if (cleanName.includes('nike') && imgName.includes('nike')) {
      images.push(img);
    }
    if (cleanName.includes('canberra') && imgName.includes('canberra')) {
      images.push(img);
    }
    if (cleanName.includes('chelsea') && imgName.includes('chelsea')) {
      images.push(img);
    }
    if (cleanName.includes('madrid') && imgName.includes('madrid')) {
      images.push(img);
    }
    if (cleanName.includes('barcelona') && imgName.includes('barcelona')) {
      images.push(img);
    }
    if (cleanName.includes('chile') && imgName.includes('chile')) {
      images.push(img);
    }
  }
  
  return [...new Set(images)].slice(0, 4); // Max 4 images per installation
}

// Generate slug from filename for matching
function generateSlug(filename) {
  return filename
    .replace(/\.html$/, '')
    .replace(/\d+-/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

async function buildCompleteMapping() {
  try {
    console.log('🔍 Building complete image mapping...');
    
    // Get all installation HTML files
    const files = fs.readdirSync(installationsDir)
      .filter(file => file.endsWith('.html') && !file.includes('.backup'))
      .sort();
    
    console.log(`📁 Found ${files.length} installation files`);
    
    const imageMapping = {};
    let totalWithImages = 0;
    let totalImages = 0;
    
    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      const progress = `[${i + 1}/${files.length}]`;
      
      try {
        const filePath = path.join(installationsDir, filename);
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        
        // Extract images
        const images = extractImagesFromHTML(htmlContent, filename);
        
        if (images.length > 0) {
          const slug = generateSlug(filename);
          imageMapping[slug] = {
            filename: filename,
            images: images,
            count: images.length
          };
          
          totalWithImages++;
          totalImages += images.length;
          
          console.log(`${progress} ✅ ${filename} -> ${images.length} images`);
          if (images.length <= 3) {
            console.log(`    📸 ${images.join(', ')}`);
          } else {
            console.log(`    📸 ${images.slice(0, 2).join(', ')}... (+${images.length - 2} more)`);
          }
        } else {
          console.log(`${progress} ⚠️  ${filename} -> No images found`);
        }
        
      } catch (error) {
        console.log(`${progress} ❌ Error processing ${filename}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total files: ${files.length}`);
    console.log(`   With images: ${totalWithImages}`);
    console.log(`   Total images: ${totalImages}`);
    console.log(`   Average: ${(totalImages / totalWithImages).toFixed(1)} images per installation`);
    
    // Write the mapping to a JSON file
    const mappingFile = './image-mapping-complete.json';
    fs.writeFileSync(mappingFile, JSON.stringify(imageMapping, null, 2));
    console.log(`\n💾 Complete mapping saved to: ${mappingFile}`);
    
    // Generate JavaScript object for the browser tool
    const jsMapping = Object.entries(imageMapping).reduce((acc, [slug, data]) => {
      acc[slug] = data.images;
      return acc;
    }, {});
    
    const jsContent = `// Auto-generated complete image mapping
const completeImageMapping = ${JSON.stringify(jsMapping, null, 2)};

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = completeImageMapping;
} else if (typeof window !== 'undefined') {
    window.completeImageMapping = completeImageMapping;
}`;
    
    fs.writeFileSync('./admin/sanity/js/complete-image-mapping.js', jsContent);
    console.log(`✅ Browser mapping saved to: admin/sanity/js/complete-image-mapping.js`);
    
    console.log(`\n🎯 Next steps:`);
    console.log(`1. Update admin/sanity/add-images.html to use the complete mapping`);
    console.log(`2. Run the updated tool to add images to all ${totalWithImages} installations`);
    
    return imageMapping;
    
  } catch (error) {
    console.error('❌ Error building mapping:', error);
  }
}

buildCompleteMapping();