#!/usr/bin/env node
// Test script for TPV Studio Geometric Generator
// Usage: node test-generator.js

import { writeFile } from 'fs/promises';
import { generateGeometricSVG, parseBrief } from './generator.js';
import { validateGeometricSVG, generateQCReport } from './qc.js';

/**
 * Test cases for geometric generator
 */
const TEST_CASES = [
  {
    name: 'simple-playful',
    brief: 'A playful geometric design with bright colors',
    options: { mood: 'playful', composition: 'mixed', colorCount: 5, seed: 12345 }
  },
  {
    name: 'serene-bands',
    brief: 'Calm flowing ribbons in serene colors',
    options: { mood: 'serene', composition: 'bands', colorCount: 4, seed: 67890 }
  },
  {
    name: 'energetic-islands',
    brief: 'Dynamic organic shapes with vibrant energy',
    options: { mood: 'energetic', composition: 'islands', colorCount: 6, seed: 11111 }
  },
  {
    name: 'ocean-fish',
    brief: 'Ocean theme with fish and bubbles',
    options: { mood: 'serene', composition: 'motifs', colorCount: 5, seed: 22222 }
  },
  {
    name: 'bold-mixed',
    brief: 'Bold striking design with stars and bands',
    options: { mood: 'bold', composition: 'mixed', colorCount: 7, seed: 33333 }
  }
];

/**
 * Run all test cases
 */
async function runTests() {
  console.log('=== TPV Studio Geometric Generator Test Suite ===\n');

  let passCount = 0;
  let failCount = 0;

  for (const testCase of TEST_CASES) {
    console.log(`\n--- Test: ${testCase.name} ---`);
    console.log(`Brief: "${testCase.brief}"`);
    console.log(`Options:`, testCase.options);

    try {
      // Generate design
      const startTime = Date.now();
      const { svg, metadata } = await generateGeometricSVG({
        brief: testCase.brief,
        canvas: { width_mm: 10000, height_mm: 10000 },
        options: testCase.options
      });
      const generationTime = Date.now() - startTime;

      console.log(`✓ Generated in ${generationTime}ms`);
      console.log(`  Layers: ${metadata.layerCount}`);
      console.log(`  Colors: ${metadata.palette.join(', ')}`);
      console.log(`  Composition:`, metadata.composition);

      // Validate design
      const validation = await validateGeometricSVG(svg, metadata);

      if (validation.pass) {
        console.log('✓ QC PASSED');
        passCount++;
      } else {
        console.log('✗ QC FAILED');
        console.log('  Issues:', validation.issues);
        failCount++;
      }

      if (validation.warnings.length > 0) {
        console.log('  Warnings:', validation.warnings);
      }

      // Save SVG to file
      const filename = `test-output-${testCase.name}.svg`;
      await writeFile(filename, svg, 'utf-8');
      console.log(`✓ Saved to ${filename}`);

      // Generate and save QC report
      const report = generateQCReport(validation, metadata);
      const reportFilename = `test-report-${testCase.name}.txt`;
      await writeFile(reportFilename, report, 'utf-8');
      console.log(`✓ Report saved to ${reportFilename}`);

    } catch (error) {
      console.error(`✗ ERROR: ${error.message}`);
      console.error(error.stack);
      failCount++;
    }
  }

  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`Total: ${TEST_CASES.length}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Success Rate: ${((passCount / TEST_CASES.length) * 100).toFixed(1)}%`);

  if (failCount === 0) {
    console.log('\n✓ All tests passed!');
    process.exit(0);
  } else {
    console.log('\n✗ Some tests failed.');
    process.exit(1);
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { runTests };
