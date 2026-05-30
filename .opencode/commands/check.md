---
description: "Run typecheck + lint"
agent: build
---
bunx tsc --noEmit --project tsconfig.typecheck.json||bun run build||bun run check
