---
title: "Validate buyDate before comparing/persisting"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/modules/portfolio/v1/usecases/create-holding.usecase.ts"
lines: "29-36"
status: backlog
created: 2026-02-28
---

# Validate buyDate before comparing/persisting

## Problem

`new Date(request.buyDate)` can produce an `Invalid Date`. When this happens, `getTime()` returns `NaN`, so the future-date check is silently skipped and an invalid date can be persisted or throw later.

## Solution

Add a validity check immediately after parsing the date, before the future-check logic.

```diff
 if (request.buyDate) {
   const buyDate = new Date(request.buyDate)
+  if (Number.isNaN(buyDate.getTime())) {
+    throw new ValidationError('Invalid buy date', {
+      buyDate: 'Buy date must be a valid date'
+    })
+  }
   // Allow 24h buffer for timezone differences
   if (buyDate.getTime() > new Date().getTime() + 86_400_000) {
```

## Verification

- Build passes: `npm run build`
- Test with invalid date string (e.g., `"not-a-date"`) — should throw `ValidationError`
- Test with valid date — should pass through normally
