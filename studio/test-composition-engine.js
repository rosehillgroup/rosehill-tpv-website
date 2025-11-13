// Test script for composition engine with ocean theme
import { generateGeometricSVG, parseBrief } from './api/_utils/geometric/generator.js';
import { writeFileSync } from 'fs';

async function testCompositionEngine() {
  console.log('=== Testing Composition Engine ===\n');

  const brief = 'ocean theme with fish and sea creatures';

  console.log(`Brief: "${brief}"\n`);

  // Parse the brief first
  console.log('Parsing brief...');
  const parsedParams = await parseBrief(brief, { width_mm: 5000, height_mm: 5000 });

  console.log('Parsed parameters:');
  console.log('- Themes:', parsedParams.metadata.themes);
  console.log('- Mood:', parsedParams.options.mood);
  console.log('- Composition:', parsedParams.options.composition);
  console.log('- Recipe:', parsedParams.layout.recipe);
  console.log('- Complexity:', parsedParams.layout.complexity);
  console.log();

  // Generate with composition engine
  console.log('Generating SVG with composition engine...');
  const result = await generateGeometricSVG({
    brief,
    canvas: { width_mm: 5000, height_mm: 5000 },
    options: {
      mood: parsedParams.options.mood,
      composition: parsedParams.options.composition,
      colorCount: 5,
      seed: 12345 // Fixed seed for reproducibility
    },
    layout: parsedParams.layout,
    metadata: parsedParams.metadata
  });

  console.log('\nGeneration complete!');
  console.log('- Layers:', result.metadata.layerCount);
  console.log('- Recipe used:', result.metadata.composition.recipe);
  console.log('- Complexity:', result.metadata.composition.complexity);
  console.log('- Palette:', result.metadata.palette);
  console.log('- Element counts:');
  console.log(`  - Bands: ${result.metadata.composition.bands}`);
  console.log(`  - Islands: ${result.metadata.composition.islands}`);
  console.log(`  - Motifs: ${result.metadata.composition.motifs}`);

  // Write output
  const outputPath = './test-outputs/composition-engine-test.svg';
  writeFileSync(outputPath, result.svg);
  console.log(`\n✓ SVG written to ${outputPath}`);
  console.log('\nTest complete!');
}

testCompositionEngine().catch(error => {
  console.error('Test failed:', error);
  console.error(error.stack);
  process.exit(1);
});
