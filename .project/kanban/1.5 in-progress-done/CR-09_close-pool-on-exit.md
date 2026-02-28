---
title: "Close connection pool on script exit"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/scrapers/verify-logging.ts"
lines: "53-60"
status: backlog
created: 2026-02-28
---

# Close connection pool on script exit

## Problem

The `finally` block disconnects Prisma but does not call `pool.end()`. This leaves the `pg.Pool` open, which can exhaust database connections over repeated runs.

## Solution

Add `await pool.end()` in the finally block alongside `prisma.$disconnect()`.

```diff
 main()
   .catch((e) => {
     console.error(e)
     process.exit(1)
   })
   .finally(async () => {
     await prisma.$disconnect()
+    await pool.end()
   })
```

## Verification

- Build passes: `npm run build`
- Script exits cleanly without lingering connections
- No "connection pool exhausted" errors on repeated runs
