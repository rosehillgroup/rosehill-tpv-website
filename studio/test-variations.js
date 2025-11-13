// Test Variation Generator for TPV Studio Geometric Mode
import {
  generateVariations,
  generateVariationGrid,
  regenerateWithSeed,
  generateProgressiveComplexity,
  generateMoodFamily
} from './api/_utils/geometric/variation-generator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, 'test-outputs', 'variations');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Base design parameters
const baseParams = {
  brief: 'Playful ocean playground with marine life',
  canvas: {
    width_mm: 3000,
    height_mm: 3000
  },
  options: {
    mood: 'playful',
    composition: 'mixed',
    colorCount: 5,
    seed: 55555
  }
};

async function testVariationGenerator() {
  console.log('🧪 Testing Variation Generator\n');

  // Test 1: Basic variations
  console.log('📐 Test 1: Generating 4 basic variations (same params, different seeds)');
  console.log('─'.repeat(80));
  try {
    const variations = await generateVariations(baseParams, 4);

    console.log(`✅ Generated ${variations.length} variations`);

    variations.forEach((v, i) => {
      const filename = `basic-variation-${i + 1}.svg`;
      const filepath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filepath, v.svg, 'utf-8');
      console.log(`   ${i + 1}. Seed: ${v.seed} → ${filename} (${(v.svg.length / 1024).toFixed(1)} KB)`);
    });

  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
  }

  // Test 2: Variations with color changes
  console.log('\n📐 Test 2: Generating variations with color variation');
  console.log('─'.repeat(80));
  try {
    const variations = await generateVariations(baseParams, 3, { varyColors: true });

    console.log(`✅ Generated ${variations.length} variations with color variation`);

    variations.forEach((v, i) => {
      const filename = `color-variation-${i + 1}.svg`;
      const filepath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filepath, v.svg, 'utf-8');
      console.log(`   ${i + 1}. Colors: ${v.metadata.colorCount}, Seed: ${v.seed} → ${filename}`);
    });

  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
  }

  // Test 3: Grid layout
  console.log('\n📐 Test 3: Generating 2x2 variation grid');
  console.log('─'.repeat(80));
  try {
    const grid = await generateVariationGrid(baseParams, 2, 2);

    console.log(`✅ Generated ${grid.length}x${grid[0].length} grid`);

    grid.forEach((row, r) => {
      row.forEach((variation, c) => {
        if (variation) {
          const filename = `grid-${r}-${c}.svg`;
          const filepath = path.join(OUTPUT_DIR, filename);
          fs.writeFileSync(filepath, variation.svg, 'utf-8');
          console.log(`   [${r},${c}] Seed: ${variation.seed} → ${filename}`);
        }
      });
    });

  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
  }

  // Test 4: Regenerate with specific seed
  console.log('\n📐 Test 4: Regenerate design with specific seed');
  console.log('─'.repeat(80));
  try {
    const specificSeed = 55555;
    const regenerated = await regenerateWithSeed(baseParams, specificSeed);

    const filename = `regenerated-${specificSeed}.svg`;
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, regenerated.svg, 'utf-8');

    console.log(`✅ Regenerated design with seed ${specificSeed}`);
    console.log(`   Saved to: ${filename} (${(regenerated.svg.length / 1024).toFixed(1)} KB)`);

  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
  }

  // Test 5: Progressive complexity
  console.log('\n📐 Test 5: Progressive complexity variations');
  console.log('─'.repeat(80));
  try {
    const complexity = await generateProgressiveComplexity(baseParams, 3);

    console.log(`✅ Generated ${complexity.length} complexity levels`);

    complexity.forEach((v, i) => {
      const filename = `complexity-${v.metadata.complexityLabel.toLowerCase()}.svg`;
      const filepath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filepath, v.svg, 'utf-8');
      console.log(`   ${i + 1}. ${v.metadata.complexityLabel}: ${v.metadata.colorCount} colors, ${v.metadata.mood} mood → ${filename}`);
    });

  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
  }

  // Test 6: Mood family
  console.log('\n📐 Test 6: Mood family variations');
  console.log('─'.repeat(80));
  try {
    const moods = await generateMoodFamily(baseParams);

    console.log(`✅ Generated ${moods.length} mood variations`);

    moods.forEach((v, i) => {
      const filename = `mood-${v.mood}.svg`;
      const filepath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filepath, v.svg, 'utf-8');
      console.log(`   ${i + 1}. ${v.mood.padEnd(10)} → ${filename} (${(v.svg.length / 1024).toFixed(1)} KB)`);
    });

  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
  }

  console.log('\n\n🎉 Variation generator test complete!');
  console.log(`📂 Output directory: ${OUTPUT_DIR}`);
  console.log('\nGenerated files:');
  console.log('- 4 basic variations (seed-based)');
  console.log('- 3 color variations');
  console.log('- 2x2 grid (4 variations)');
  console.log('- 1 regenerated design');
  console.log('- 3 complexity levels');
  console.log('- 5 mood variations');
  console.log(`\nTotal: ~20 SVG files in ${OUTPUT_DIR}`);
}

testVariationGenerator().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
