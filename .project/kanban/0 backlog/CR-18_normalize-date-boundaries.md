---
title: "Normalize date boundaries for daily close queries"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/modules/prices/v1/delivery/http/prices-controller.ts"
lines: "74-87"
status: backlog
created: 2026-02-28
---

# Normalize date boundaries for daily close queries

## Problem

The `from` and `to` dates retain their time components when passed to the query, but the database stores `closeDate` as a `DATE` type (midnight). When comparing a timestamp like `2025-01-16T14:30:45Z` against `DATE 2025-01-16`, the first day can be excluded because `00:00:00 < 14:30:45`.

## Solution

Normalize dates to day boundaries after the range calculation.

```diff
 switch (range) {
   case '3d': from.setDate(from.getDate() - 3); break
   case '1w':
   case '7d': from.setDate(from.getDate() - 7); break
   case '1m':
   case '30d': from.setDate(from.getDate() - 30); break
   case '90d': from.setDate(from.getDate() - 90); break
   case '1y': from.setFullYear(from.getFullYear() - 1); break
   case '5y': from.setFullYear(from.getFullYear() - 5); break
   case 'all': from.setFullYear(2020, 0, 1); break
 }
+from.setHours(0, 0, 0, 0)
+to.setHours(23, 59, 59, 999)
```

## Verification

- Build passes: `npm run build`
- Query with time-of-day timestamps returns correct date range
- First and last days of range are always included
