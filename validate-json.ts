import { join } from "node:path";

const glob = new Bun.Glob("src/content/*.json");
const files: string[] = [];

for await (const file of glob.scan({ cwd: process.cwd() })) {
  files.push(file);
}

files.sort();

if (files.length === 0) {
  console.error("❌ No JSON files found in src/content.");
  process.exit(1);
}

let hasError = false;

for (const file of files) {
  try {
    const filePath = join(process.cwd(), file);
    const content = await Bun.file(filePath).text();
    JSON.parse(content);
    console.log(`✅ ${file} is valid JSON`);
  } catch (e) {
    hasError = true;
    console.error(
      `❌ ${file} is INVALID JSON: ${e instanceof Error ? e.message : String(e)}`,
    );

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
          console.error("Context:", content.substring(start, end));
          console.error(" ".repeat(Math.min(50, pos)) + "^");
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
