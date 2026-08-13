const fs = require('fs');
const readline = require('readline');

async function run() {
  const fileStream = fs.createReadStream('C:\\Users\\Anuj\\.gemini\\antigravity\\brain\\1903f2d5-ebf5-4fc2-b8c1-73e2bcd326c6\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const parsed = JSON.parse(line);
    if (parsed.step_index === 2026) {
      console.log('--- CONTENT START ---');
      console.log(parsed.content);
      console.log('--- CONTENT END ---');
      break;
    }
  }
}

run().catch(console.error);
