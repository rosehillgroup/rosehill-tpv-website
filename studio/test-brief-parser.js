// Test Claude Haiku Brief Parser
import { parseBrief } from './api/_utils/geometric/brief-parser.js';

const testBriefs = [
  "Create a vibrant ocean theme with playful dolphins and colorful coral reefs",
  "I want a serene forest design with calm nature elements, use 4 colors",
  "Bold and energetic space theme with rockets and planets, make it striking!",
  "Playful fast food design for a kids' play area, with burgers and pizza motifs",
  "Create horizontal bands with energetic colors for an athletic gym playground",
];

async function testParser() {
  console.log('🧪 Testing Claude Haiku Brief Parser\n');

  for (let i = 0; i < testBriefs.length; i++) {
    const brief = testBriefs[i];
    console.log(`\n📝 Test ${i + 1}: "${brief}"`);
    console.log('─'.repeat(80));

    try {
      const result = await parseBrief(brief);

      console.log('✅ Parsed successfully:');
      console.log(`   Brief: ${result.brief}`);
      console.log(`   Mood: ${result.options.mood}`);
      console.log(`   Composition: ${result.options.composition}`);
      console.log(`   Color Count: ${result.options.colorCount}`);
      if (result.metadata?.themes) {
        console.log(`   Themes: ${result.metadata.themes.join(', ')}`);
      }
      if (result.metadata?.reasoning) {
        console.log(`   Reasoning: ${result.metadata.reasoning}`);
      }

    } catch (error) {
      console.error(`❌ Failed to parse: ${error.message}`);
    }
  }

  console.log('\n\n🎉 Brief parser test complete!\n');
}

testParser().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
