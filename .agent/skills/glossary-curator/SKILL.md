---
name: glossary-curator
description: Create and refine glossary entries with consistent taxonomy, cross-linking, and editorial quality.
required_tools:
  - run_command
version: 1.0.0
---

# Glossary Curator Skill

Use when adding, expanding, or restructuring glossary terms and adjacent educational content.

## Workflow

1. **Term design**
   - Define a one-sentence canonical definition.
   - Add practical context: why it matters, common misuse, and implementation relevance.

2. **Content consistency**
   - Follow established voice and reading level in existing glossary entries.
   - Keep sections scannable with short headings and concise paragraphs.

3. **Linking and taxonomy**
   - Add links to adjacent concepts and route-level references.
   - Ensure tags/categories remain consistent with related entries.

4. **Navigation and retrieval**
   - Confirm term appears in any glossary index/listing surfaces.
   - Avoid duplicate aliases unless intentional and explained.

5. **Validation**
   - Run `bun run check`.
   - Verify the entry renders correctly and internal links resolve.

## Done criteria

- Term has a clear definition plus actionable context.
- Related concepts are cross-linked.
- Index/listing surfaces include the new or updated term.
