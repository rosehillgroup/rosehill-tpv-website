#!/usr/bin/env node

/**
 * Test script to verify Supabase image optimization is working
 */

// Test the transformation functions
const testSupabaseUrl = 'https://otidaseqlgubqzsqazqt.supabase.co/storage/v1/object/public/installation-images/installations/test-image.jpg';

// Import the functions from the generator
const fs = require('fs');
const path = require('path');

// Read the generator file and extract the functions
const generatorPath = path.join(__dirname, 'generate-installation-pages-supabase.js');
const generatorCode = fs.readFileSync(generatorPath, 'utf8');

// Extract the transformSupabaseUrl function
const transformSupabaseUrlMatch = generatorCode.match(/function transformSupabaseUrl\([\s\S]*?\n\}/);
if (transformSupabaseUrlMatch) {
    eval(transformSupabaseUrlMatch[0]);
} else {
    console.error('Could not find transformSupabaseUrl function');
    process.exit(1);
}

// Extract the createOptimizedPictureElement function
const createOptimizedPictureElementMatch = generatorCode.match(/function createOptimizedPictureElement\([\s\S]*?\n\}/);
if (createOptimizedPictureElementMatch) {
    eval(createOptimizedPictureElementMatch[0]);
} else {
    console.error('Could not find createOptimizedPictureElement function');
    process.exit(1);
}

console.log('🧪 Testing Supabase Image Optimization');
console.log('=====================================');

// Test 1: Basic transformation
console.log('\n1. Testing basic transformation:');
const galleryUrl = transformSupabaseUrl(testSupabaseUrl, { width: 400, height: 300, format: 'webp' });
console.log('Original:', testSupabaseUrl);
console.log('Gallery: ', galleryUrl);

// Test 2: Modal transformation
console.log('\n2. Testing modal transformation:');
const modalUrl = transformSupabaseUrl(testSupabaseUrl, { width: 1200, height: 800, format: 'webp' });
console.log('Modal:   ', modalUrl);

// Test 3: JPEG fallback
console.log('\n3. Testing JPEG fallback:');
const jpegUrl = transformSupabaseUrl(testSupabaseUrl, { width: 400, height: 300, quality: 75 });
console.log('JPEG:    ', jpegUrl);

// Test 4: Picture element generation
console.log('\n4. Testing picture element generation:');
const pictureElement = createOptimizedPictureElement(
    testSupabaseUrl,
    'Test Image',
    { width: 400, height: 300 },
    'openModal(0)'
);
console.log('Picture element:');
console.log(pictureElement);

// Test 5: Non-Supabase URL handling
console.log('\n5. Testing non-Supabase URL handling:');
const localUrl = '../images/installations/local-image.jpg';
const localPictureElement = createOptimizedPictureElement(
    localUrl,
    'Local Image',
    { width: 400, height: 300 },
    'openModal(1)'
);
console.log('Local URL result:');
console.log(localPictureElement);

// Test 6: Parameter validation
console.log('\n6. Testing parameter validation:');
const emptyUrl = transformSupabaseUrl('', { width: 400, height: 300 });
console.log('Empty URL result:', emptyUrl);

const nullUrl = transformSupabaseUrl(null, { width: 400, height: 300 });
console.log('Null URL result:', nullUrl);

// Test 7: Expected URL structure validation
console.log('\n7. URL structure validation:');
const expectedParams = [
    'width=400',
    'height=300', 
    'quality=75',
    'resize=cover',
    'format=webp'
];

const hasAllParams = expectedParams.every(param => galleryUrl.includes(param));
console.log('✅ All expected parameters present:', hasAllParams);

if (!hasAllParams) {
    console.log('❌ Missing parameters. Expected:', expectedParams);
    console.log('   Found in URL:', galleryUrl);
}

// Test 8: Performance estimation
console.log('\n8. Performance estimation:');
console.log('Expected benefits:');
console.log('- Gallery images: ~400x300 instead of full size');
console.log('- Modal images: ~1200x800 instead of full size');
console.log('- WebP format: ~30-50% smaller than JPEG');
console.log('- Lazy loading: Better perceived performance');
console.log('- CDN delivery: Faster global access');

console.log('\n✅ Optimization test completed!');
console.log('\nNext steps:');
console.log('1. Upload a new installation via admin form');
console.log('2. Check browser Network tab for optimized images');
console.log('3. Verify WebP format is being served');
console.log('4. Test modal functionality with optimized images');