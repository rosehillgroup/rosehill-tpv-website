// Test file for color science functions
// Run with: node test-color-science.js

import {
  PALETTE,
  shareCodeToColors,
  hexToRgb,
  rgbToHex,
  computeAverageBlend,
  decodeMix,
  rgbToOklab,
  deltaE
} from './color-science.js';

console.log('=== TPV Color Science Tests ===\n');

// Test 1: Palette loading
console.log('Test 1: Palette Loading');
console.log(`✓ Loaded ${PALETTE.length} colors`);
console.log(`  First color: ${PALETTE[0].code} - ${PALETTE[0].name} (${PALETTE[0].hex})`);
console.log(`  Last color: ${PALETTE[PALETTE.length - 1].code} - ${PALETTE[PALETTE.length - 1].name} (${PALETTE[PALETTE.length - 1].hex})\n`);

// Test 2: Hex to RGB conversion
console.log('Test 2: Hex to RGB Conversion');
const testHex = '#E4C4AA';
const rgb = hexToRgb(testHex);
console.log(`  ${testHex} → RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`);
const backToHex = rgbToHex(rgb.r, rgb.g, rgb.b);
console.log(`  RGB(${rgb.r}, ${rgb.g}, ${rgb.b}) → ${backToHex}`);
console.log(`  ${testHex === backToHex.toUpperCase() ? '✓' : '✗'} Round-trip conversion\n`);

// Test 3: Share code decoding
console.log('Test 3: Share Code Decoding');
// Share code format: pairs of base36 chars [colorIndex, count]
// Example: "0A" = color 0 (RH30) with count 10
const testShareCode = '0A14'; // Color 0 with 10 parts, color 1 with 4 parts
const parts = decodeMix(testShareCode);
console.log(`  Share code: "${testShareCode}"`);
console.log(`  Decoded parts:`, parts);

const colors = shareCodeToColors(testShareCode);
console.log(`  Decoded colors: ${colors.length} colors`);
colors.forEach(color => {
  console.log(`    - ${color.name} (${color.code}): ${color.proportion.toFixed(1)}%`);
});
console.log();

// Test 4: Color blending
console.log('Test 4: Color Blending');
const blendParts = { 'RH30': 5, 'RH31': 5 }; // Equal blend of Beige and Cream
const blendedHex = computeAverageBlend(blendParts);
console.log(`  Blending ${Object.keys(blendParts).join(' + ')}`);
console.log(`  RH30 (Beige): ${PALETTE[0].hex}`);
console.log(`  RH31 (Cream): ${PALETTE[1].hex}`);
console.log(`  Blended result: ${blendedHex}\n`);

// Test 5: OKLab color space conversion
console.log('Test 5: OKLab Color Space');
const testRgb = { r: 228, g: 196, b: 170 }; // Beige
const lab = rgbToOklab(testRgb);
console.log(`  RGB(${testRgb.r}, ${testRgb.g}, ${testRgb.b}) → OKLab:`);
console.log(`    L: ${lab.L.toFixed(3)}`);
console.log(`    a: ${lab.a.toFixed(3)}`);
console.log(`    b: ${lab.b.toFixed(3)}\n`);

// Test 6: Delta E calculation
console.log('Test 6: Delta E Color Difference');
const color1 = rgbToOklab({ r: 228, g: 196, b: 170 }); // Beige
const color2 = rgbToOklab({ r: 232, g: 227, b: 216 }); // Cream
const dE = deltaE(color1, color2);
console.log(`  Beige vs Cream ΔE: ${dE.toFixed(3)}`);
console.log(`  ${dE < 5 ? '✓ Perceptually similar' : '✗ Perceptually different'}\n`);

// Test 7: Multi-color share code
console.log('Test 7: Multi-Color Share Code');
const multiColorCode = '0512'; // RH30×5, RH01×1, RH20×2
const multiColors = shareCodeToColors(multiColorCode);
console.log(`  Share code: "${multiColorCode}"`);
console.log(`  Colors: ${multiColors.length}`);
const totalProportion = multiColors.reduce((sum, c) => sum + c.proportion, 0);
console.log(`  Total proportion: ${totalProportion.toFixed(1)}%`);
console.log(`  ${Math.abs(totalProportion - 100) < 0.1 ? '✓' : '✗'} Proportions sum to 100%\n`);

// Test 8: Invalid inputs
console.log('Test 8: Error Handling');
const invalidShareCode = 'ZZZZ';
const invalidColors = shareCodeToColors(invalidShareCode);
console.log(`  Invalid share code "${invalidShareCode}": ${invalidColors.length} colors`);
console.log(`  ${invalidColors.length === 0 ? '✓' : '✗'} Correctly returns empty array\n`);

console.log('=== All Tests Complete ===');
