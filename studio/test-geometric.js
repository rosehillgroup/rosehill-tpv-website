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

// Test cases with different recipes, themes, and complexity levels
const testCases = [
  // Hero Orbit Recipe Tests
  {
    name: 'ocean-hero-orbit-medium',
    brief: 'Playful ocean theme with whale and fish',
    options: {
      mood: 'playful',
      composition: 'motifs',
      colorCount: 5,
      seed: 12345
    },
    layout: {
      recipe: 'hero_orbit',
      complexity: 'medium'
    },
    metadata: {
      themes: ['ocean']
    }
  },
  {
    name: 'space-hero-orbit-complex',
    brief: 'Energetic space adventure with rocket and stars',
    options: {
      mood: 'energetic',
      composition: 'motifs',
      colorCount: 6,
      seed: 23456
    },
    layout: {
      recipe: 'hero_orbit',
      complexity: 'complex'
    },
    metadata: {
      themes: ['space']
    }
  },

  // Trail Recipe Tests
  {
    name: 'transport-trail-medium',
    brief: 'Dynamic transport journey with vehicles',
    options: {
      mood: 'energetic',
      composition: 'mixed',
      colorCount: 5,
      seed: 34567
    },
    layout: {
      recipe: 'trail',
      complexity: 'medium'
    },
    metadata: {
      themes: ['transport']
    }
  },
  {
    name: 'nature-trail-simple',
    brief: 'Serene nature path through the forest',
    options: {
      mood: 'serene',
      composition: 'mixed',
      colorCount: 4,
      seed: 45678
    },
    layout: {
      recipe: 'trail',
      complexity: 'simple'
    },
    metadata: {
      themes: ['nature']
    }
  },

  // Cluster Recipe Tests
  {
    name: 'gym-cluster-medium',
    brief: 'Bold gym fitness equipment cluster',
    options: {
      mood: 'bold',
      composition: 'islands',
      colorCount: 5,
      seed: 56789
    },
    layout: {
      recipe: 'cluster',
      complexity: 'medium'
    },
    metadata: {
      themes: ['gym']
    }
  },
  {
    name: 'fastfood-cluster-complex',
    brief: 'Playful cafe with burgers, pizza, and fries',
    options: {
      mood: 'playful',
      composition: 'islands',
      colorCount: 6,
      seed: 67890
    },
    layout: {
      recipe: 'cluster',
      complexity: 'complex'
    },
    metadata: {
      themes: ['fastfood']
    }
  },

  // Striped Story Recipe Tests
  {
    name: 'spring-striped-medium',
    brief: 'Calm spring garden with flowers and butterflies',
    options: {
      mood: 'calm',
      composition: 'bands',
      colorCount: 5,
      seed: 78901
    },
    layout: {
      recipe: 'striped_story',
      complexity: 'medium'
    },
    metadata: {
      themes: ['spring']
    }
  },
  {
    name: 'landmarks-striped-complex',
    brief: 'Bold cityscape with towers and buildings',
    options: {
      mood: 'bold',
      composition: 'bands',
      colorCount: 6,
      seed: 89012
    },
    layout: {
      recipe: 'striped_story',
      complexity: 'complex'
    },
    metadata: {
      themes: ['landmarks']
    }
  },

  // Auto-selection tests (no recipe specified)
  {
    name: 'trees-auto-select',
    brief: 'Serene woodland with oak and pine trees',
    options: {
      mood: 'serene',
      composition: 'mixed',
      colorCount: 5,
      seed: 90123
    },
    layout: {
      complexity: 'medium'
    },
    metadata: {
      themes: ['trees']
    }
  },
  {
    name: 'alphabet-auto-select',
    brief: 'Playful alphabet learning playground',
    options: {
      mood: 'playful',
      composition: 'mixed',
      colorCount: 6,
      seed: 101234
    },
    layout: {
      complexity: 'simple'
    },
    metadata: {
      themes: ['alphabet']
    }
  }
];

async function runTests() {
  console.log('🧪 Testing Geometric Generator with Motif Roles & Layout Recipes\n');

  const canvas = {
    width_mm: 5000,
    height_mm: 5000
  };

  for (const testCase of testCases) {
    try {
      console.log(`\n📐 Generating: ${testCase.name}`);
      console.log(`   Brief: "${testCase.brief}"`);
      console.log(`   Recipe: ${testCase.layout?.recipe || 'auto'}, Complexity: ${testCase.layout?.complexity || 'medium'}`);
      console.log(`   Theme: ${testCase.metadata?.themes?.join(', ') || 'none'}`);

      const result = await generateGeometricSVG({
        brief: testCase.brief,
        canvas,
        options: testCase.options,
        layout: testCase.layout || {},
        metadata: testCase.metadata || {}
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
  console.log('1. Review generated SVG files for each recipe (hero_orbit, trail, cluster, striped_story)');
  console.log('2. Verify hero motifs are prominent (30-40% of canvas)');
  console.log('3. Check that support motifs complement heroes without competing');
  console.log('4. Confirm layouts follow recipe patterns (orbital, trail, cluster, striped)');
  console.log('5. Verify motifs match themes (ocean → whale/fish, space → rocket/stars, etc.)');
  console.log('6. Check color palettes show role-based assignment (hero = accent, support = mid-palette)');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
