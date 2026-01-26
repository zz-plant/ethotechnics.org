# Type Fix Examples

Common patterns for resolving TypeScript issues in this project.

## 1. Replacing `any`

```typescript
// Before
function handle(data: any) {
  console.log(data.id);
}

// After
interface DataNode {
  id: string;
}

function handle(data: unknown) {
  if (data && typeof data === 'object' && 'id' in data) {
    const node = data as DataNode;
    console.log(node.id);
  }
}
```

## 2. Explicit Return Types

```typescript
// Before
export function getCount() {
  return 10;
}

// After
export function getCount(): number {
  return 10;
}
```
