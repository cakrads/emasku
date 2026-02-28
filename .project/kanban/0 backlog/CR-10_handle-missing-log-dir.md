---
title: "Handle missing log directory gracefully"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/scrapers/verify-logging.ts"
lines: "39-50"
status: backlog
created: 2026-02-28
---

# Handle missing log directory gracefully

## Problem

`fs.readdirSync(logDir)` will throw an `ENOENT` error if the `.scrap/logs` directory hasn't been created yet, crashing the script.

## Solution

Check for directory existence before reading.

```diff
 console.log('\n--- Step 3: Checking Logs ---')
 const logDir = path.join(process.cwd(), '.scrap', 'logs')
-const files = fs.readdirSync(logDir).filter(f => f.endsWith('.log')).sort().reverse()
+
+if (!fs.existsSync(logDir)) {
+  console.log('Log directory does not exist yet.')
+  return
+}
+
+const files = fs.readdirSync(logDir).filter(f => f.endsWith('.log')).sort().reverse()
 if (files.length > 0) {
```

## Verification

- Build passes: `npm run build`
- Run verify-logging without `.scrap/logs` dir → should print info message, not crash
- Run with existing logs → should work normally
