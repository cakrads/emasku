---
title: "Handle debug file write on read-only filesystem"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/scrapers/galeri24.scraper.ts"
lines: "85-92"
status: backlog
created: 2026-02-28
---

# Handle debug file write on read-only filesystem

## Problem

When `__NUXT_DATA__` is not found, the code writes to `debug-failed-scrape.html`. On Vercel's read-only filesystem, `fs.writeFileSync` will throw an error, masking the original "not found" error.

## Solution

Skip file write on Vercel or wrap in try/catch.

```diff
 if (!match) {
   console.error('[Galeri24] Could not find __NUXT_DATA__ script tag')
-  console.log('[Galeri24] Saving HTML to debug-failed-scrape.html for inspection')
-  const fs = await import('fs')
-  fs.writeFileSync('debug-failed-scrape.html', html)
+  const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL
+  if (!isVercel) {
+    console.log('[Galeri24] Saving HTML to debug-failed-scrape.html for inspection')
+    const fs = await import('fs')
+    fs.writeFileSync('debug-failed-scrape.html', html)
+  } else {
+    console.log('[Galeri24] First 1000 chars of HTML:', html.substring(0, 1000))
+  }
   throw new Error('__NUXT_DATA__ not found in page source')
 }
```

## Verification

- Build passes: `npm run build`
- On Vercel → no write attempt, logs first 1000 chars instead
- Locally → debug file is still written for inspection
