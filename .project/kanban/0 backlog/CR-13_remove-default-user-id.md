---
title: "Remove default userId in portfolio history"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/modules/portfolio/v1/usecases/get-portfolio-history.ts"
lines: "16"
status: backlog
created: 2026-02-28
---

# Remove default userId in portfolio history

## Problem

The `execute` method has a default value `'default-user-id'` for `userId`. This could cause silent failures or data leakage if callers forget to pass the actual userId.

## Solution

Make `userId` required and add a runtime guard.

```diff
-async execute(userId: string = 'default-user-id'): Promise<PortfolioHistoryDomain> {
+async execute(userId: string): Promise<PortfolioHistoryDomain> {
+  if (!userId) {
+    throw new Error('userId is required')
+  }
```

## Verification

- Build passes: `npm run build`
- All callers of `execute()` must pass a real userId (check for compile errors)
- Calling without userId → throws clear error
