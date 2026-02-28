---
title: "Use constructor injection for portfolio repository"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/modules/portfolio/v1/usecases/get-portfolio-history.ts"
lines: "13-14"
status: backlog
created: 2026-02-28
---

# Use constructor injection for portfolio repository

## Problem

`GetPortfolioHistoryUsecase` instantiates `PrismaPortfolioRepository` directly as a class property, unlike other usecases that use constructor injection. This makes unit testing harder and is inconsistent with the codebase pattern.

## Solution

Accept the repository via constructor injection with an optional default.

```diff
 export class GetPortfolioHistoryUsecase {
-  private portfolioRepo = new PrismaPortfolioRepository()
+  constructor(private portfolioRepo: PrismaPortfolioRepository = new PrismaPortfolioRepository()) { }
```

## Verification

- Build passes: `npm run build`
- Existing callers continue to work (default parameter)
- Tests can now inject a mock repository
