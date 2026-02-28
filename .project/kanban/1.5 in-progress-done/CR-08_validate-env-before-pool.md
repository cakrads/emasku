---
title: "Validate DIRECT_URL before creating connection pool"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/scrapers/run-scraper.ts"
lines: "11-14"
status: backlog
created: 2026-02-28
---

# Validate DIRECT_URL before creating connection pool

## Problem

`DIRECT_URL` is used at line 11 to create the connection pool, but validation happens later inside `main()`. If `DIRECT_URL` is undefined or empty, the pool is created with an invalid connection string, causing a confusing error before validation can run.

## Solution

Move the validation before pool creation at module scope.

```diff
+import { DIRECT_URL, SCRAPER_SOURCE_URL } from '../lib/env'
+
+// Validate environment before creating connections
+if (!DIRECT_URL) {
+  console.error('❌ DIRECT_URL is not set in environment variables')
+  console.log('Please ensure your .env file contains DIRECT_URL')
+  process.exit(1)
+}
+
 const connectionString = DIRECT_URL
 const pool = new pg.Pool({ connectionString })
 const adapter = new PrismaPg(pool)
 const prisma = new PrismaClient({ adapter })

 async function main() {
   console.log('=== Gold Price Scraper Runner ===\n')
-  // Validate environment
-  if (!DIRECT_URL) {
-    console.error('❌ DIRECT_URL is not set in environment variables')
-    console.log('Please ensure your .env file contains DIRECT_URL')
-    process.exit(1)
-  }
   console.log(`Using database: ${DIRECT_URL.split('@')[1] || '[hidden]'}`)
```

## Verification

- Build passes: `npm run build`
- Run scraper without `DIRECT_URL` → should exit immediately with clear error
- Run scraper with valid `DIRECT_URL` → should work normally
