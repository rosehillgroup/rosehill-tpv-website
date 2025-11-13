// Test Geometric Generator with New Motif Library
import { generateGeometricSVG } from './api/_utils/geometric/generator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, 'test-outputs');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Test cases with different themes
const testCases = [
  {
    name: 'ocean-theme',
    brief: 'Playful ocean theme with waves and marine life',
    options: {
      mood: 'playful',
      composition: 'mixed',
      colorCount: 5,
      seed: 12345
    }
  },
  {
    name: 'space-theme',
    brief: 'Cosmic space adventure with stars and planets',
    options: {
      mood: 'energetic',
      composition: 'motifs',
      colorCount: 6,
      seed: 23456
    }
  },
  {
    name: 'gym-fitness',
    brief: 'Athletic gym fitness center design',
    options: {
      mood: 'bold',
      composition: 'mixed',
      colorCount: 4,
      seed: 34567
    }
  },
  {
    name: 'nature-forest',
    brief: 'Serene forest nature with trees and plants',
    options: {
      mood: 'serene',
      composition: 'islands',
      colorCount: 5,
      seed: 45678
    }
  },
  {
    name: 'fastfood-cafe',
    brief: 'Vibrant cafe with burgers and pizza',
    options: {
      mood: 'playful',
      composition: 'motifs',
      colorCount: 6,
      seed: 56789
    }
  }
];

async function runTests() {
  console.log('🧪 Testing Geometric Generator with New Motif Library\n');

  const canvas = {
    width_mm: 5000,
    height_mm: 5000
  };

  for (const testCase of testCases) {
    try {
      console.log(`\n📐 Generating: ${testCase.name}`);
      console.log(`   Brief: "${testCase.brief}"`);
      console.log(`   Options:`, testCase.options);

      const result = await generateGeometricSVG({
        brief: testCase.brief,
        canvas,
        options: testCase.options
      });

      // Save SVG to file
      const outputPath = path.join(OUTPUT_DIR, `${testCase.name}.svg`);
      fs.writeFileSync(outputPath, result.svg, 'utf-8');

      // Display metadata
      console.log(`   ✅ Generated successfully!`);
      console.log(`   📁 Saved to: ${outputPath}`);
      console.log(`   🎨 Palette: ${result.metadata.palette.join(', ')}`);
      console.log(`   📊 Layers: ${result.metadata.layerCount}`);
      console.log(`   🔧 Composition:`, result.metadata.composition);

      // Log SVG size
      const sizeKB = (result.svg.length / 1024).toFixed(1);
      console.log(`   📦 Size: ${sizeKB} KB`);

    } catch (error) {
      console.error(`   ❌ Failed to generate ${testCase.name}:`, error.message);
      console.error(error.stack);
    }
  }

  console.log('\n\n🎉 Test run complete!');
  console.log(`📂 Output directory: ${OUTPUT_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Review generated SVG files');
  console.log('2. Check that motifs match the themes (ocean → ocean motifs, etc.)');
  console.log('3. Verify color palettes and composition');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
