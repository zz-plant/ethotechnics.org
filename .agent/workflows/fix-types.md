---
description: Resolve TypeScript type errors systematically
---

# Fix TypeScript Errors Workflow

Systematic approach to resolving TypeScript type errors.

## Steps

// turbo

1. Run TypeScript check to get the full error list:

   ```powershell
   bun run typecheck
   ```

2. Identify error patterns:
   - Missing type annotations
   - Type mismatches
   - Implicit `any` usages
   - Missing imports

3. For each error, apply the appropriate fix:
   - Add explicit type annotations for missing types
   - Use type guards for narrowing `unknown` types
   - Replace `any` with proper types or `unknown` + guards
   - Add missing imports or install missing `@types/*` packages

// turbo 4. Re-run type check to verify fixes:

```powershell
bun run typecheck
```

// turbo 5. Run full check to ensure no regressions:

```powershell
bun run check
```

## Common patterns

### Replace `any` with proper types

```typescript
// Before
function process(data: any) { ... }

// After
function process(data: unknown) {
  if (typeof data === 'object' && data !== null) { ... }
}
```

### Add return type annotations

```typescript
// Before
export function getValue() {
  return 42;
}

// After
export function getValue(): number {
  return 42;
}
```

## When to use

- After `bun run typecheck` shows errors
- After upgrading dependencies with type changes
- When adding strict type checking to new code
