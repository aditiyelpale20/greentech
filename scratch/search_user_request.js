const fs = require('fs');
const readline = require('readline');

async function run() {
  const fileStream = fs.createReadStream('C:\\Users\\Anuj\\.gemini\\antigravity\\brain\\1903f2d5-ebf5-4fc2-b8c1-73e2bcd326c6\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    const parsed = JSON.parse(line);
    if (parsed.type === 'USER_INPUT') {
      const lower = parsed.content.toLowerCase();
      if (lower.includes('64.118.137.163') || lower.includes('vaishu') || lower.includes('permission') || lower.includes('denied')) {
        console.log(`Step ${parsed.step_index} (Line ${lineCount}):`, parsed.content);
      }
    }
  }
}

run().catch(console.error);
