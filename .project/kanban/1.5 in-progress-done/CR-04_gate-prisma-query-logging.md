---
title: "Gate Prisma query logging to non-production"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/persistence/prisma-client.ts"
lines: "12-14"
status: backlog
created: 2026-02-28
---

# Gate Prisma query logging to non-production

## Problem

`log: ['query']` is hardcoded in the PrismaClient constructor. In production, this exposes sensitive query data and adds unnecessary performance overhead.

## Solution

Conditionally enable query logging based on `NODE_ENV`.

```diff
 new PrismaClient({
   adapter,
-  log: ['query'],
+  log: process.env.NODE_ENV === 'production' ? [] : ['query'],
 })
```

## Verification

- Build passes: `npm run build`
- In production mode, no query logs should appear
- In development mode, query logs should still work
