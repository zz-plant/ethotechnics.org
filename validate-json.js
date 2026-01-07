import { join } from 'node:path';

const files = [
  'src/content/home.json',
  'src/content/library.json',
  'src/content/start-here.json',
  'src/content/glossary.json'
];

let hasError = false;

for (const file of files) {
  try {
    const filePath = join(process.cwd(), file);
    const content = await Bun.file(filePath).text();
    JSON.parse(content);
    console.log(`✅ ${file} is valid JSON`);
  } catch (e) {
    hasError = true;
    console.error(`❌ ${file} is INVALID JSON: ${e instanceof Error ? e.message : String(e)}`);
    
    // Output the part where it failed if possible
    if (e instanceof Error) {
        const match = e.message.match(/position (\d+)/);
        if (match) {
            const pos = parseInt(match[1]);
            try {
                const filePath = join(process.cwd(), file);
                const content = await Bun.file(filePath).text();
                const start = Math.max(0, pos - 50);
                const end = Math.min(content.length, pos + 50);
                console.error('Context:', content.substring(start, end));
                console.error(' '.repeat(Math.min(50, pos)) + '^');
            } catch (err) {
                // Ignore errors reading file for context
            }
        }
    }
  }
}

if (hasError) {
    process.exit(1);
}
