# PRD: Remove Unnecessary "use client" Directives

## Category: Performance
## Severity: Minor
## Target Files:
- `src/frontend/components/ui/alert-dialog.tsx`
- `src/frontend/components/ui/avatar.tsx`
- `src/frontend/components/ui/checkbox.tsx`
- `src/frontend/components/ui/chart-renderer.tsx`

## Problem
Radix UI wrapper components are marked as `"use client"` even though they contain no `useState`, `useEffect`, or other client-only hooks. They simply forward props to Radix primitives.

This:
- Forces all parent components to become client components (cascading).
- Increases the client-side JavaScript bundle unnecessarily.
- Prevents React Server Component (RSC) benefits from propagating.

## Evidence
```tsx
// src/frontend/components/ui/alert-dialog.tsx
"use client"  // ❌ No state or effects

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

function AlertDialog({ ...props }) {
  return <AlertDialogPrimitive.Root {...props} />
}
```

## Solution
1. Audit all `src/frontend/components/ui/*.tsx` files for `"use client"`.
2. Remove the directive from pure wrapper components that have no hooks.
3. For components that mix interactive and static parts, use `dynamic()` imports or restructure.

## Verification
- `next build` succeeds without errors.
- No runtime regressions (interactive components still work).
- Client bundle size decreases (measure with `next build --profile` or bundle analyzer).
