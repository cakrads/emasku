---
title: "Add DATABASE_URL to critical environment validation"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/lib/env.ts"
lines: "43-56"
status: backlog
created: 2026-02-28
---

# Add DATABASE_URL to critical environment validation

## Problem

`DATABASE_URL` is essential for Prisma and database connectivity but is not included in the `validateEnv()` function's critical checks. If missing, the application fails at runtime with cryptic errors.

## Solution

Add `DATABASE_URL` to the existing validation list.

```diff
 export function validateEnv(): void {
   const missing: string[] = []
+  if (!DATABASE_URL) missing.push('DATABASE_URL')
   if (!SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL')
   if (!NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)
     missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY')
```

## Verification

- Build passes: `npm run build`
- Remove `DATABASE_URL` from `.env` → should warn in dev, throw in production
- With `DATABASE_URL` set → no warnings
