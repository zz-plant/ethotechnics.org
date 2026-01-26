#!/usr/bin/env bun
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

async function audit() {
  console.log("🎨 Design Engineer: Auditing project for design primitives...\n");
  
  const componentsDir = join(process.cwd(), "src", "components");
  const files = await readdir(componentsDir, { recursive: true });
  
  let issues = 0;
  
  for (const file of files) {
    if (!file.endsWith(".astro")) continue;
    
    const content = await readFile(join(componentsDir, file), "utf-8");
    
    // Check for hardcoded colors
    if (content.includes("#") || content.includes("rgb(")) {
      console.warn(`⚠️  ${file}: Consider using CSS variables or design tokens.`);
      issues++;
    }
    
    // Check for missing aria labels on buttons (naive check)
    if (content.includes("<button") && !content.includes("aria-label")) {
       console.warn(`❌ ${file}: Button missing 'aria-label'.`);
       issues++;
    }
  }
  
  console.log(`\n📋 Audit complete. Found ${issues} potential issues.`);
}

audit().catch(console.error);
