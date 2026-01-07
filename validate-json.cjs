const fs = require('fs');
const files = [
  'src/content/home.json',
  'src/content/library.json',
  'src/content/start-here.json',
  'src/content/glossary.json'
];

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    JSON.parse(content);
    console.log(`✅ ${file} is valid JSON`);
  } catch (e) {
    console.error(`❌ ${file} is INVALID JSON: ${e.message}`);
    // Output the part where it failed if possible
    const match = e.message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1]);
      const content = fs.readFileSync(file, 'utf8');
      const start = Math.max(0, pos - 50);
      const end = Math.min(content.length, pos + 50);
      console.error('Context:', content.substring(start, end));
      console.error(' '.repeat(Math.min(50, pos)) + '^');
    }
  }
});
