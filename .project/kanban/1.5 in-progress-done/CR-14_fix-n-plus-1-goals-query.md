---
title: "Fix N+1 query in list-goals usecase"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/modules/goals/v1/usecases/list-goals.usecase.ts"
lines: "27-57"
status: backlog
created: 2026-02-28
---

# Fix N+1 query in list-goals usecase

## Problem

Nested loops cause multiple database queries: one per goal for holdings, then one per active holding for price lookup. For a user with many goals and holdings, this creates significant database overhead (N+1 problem).

## Solution

Batch-fetch all holdings and prices in 2-3 queries instead of N.

```typescript
// 1. Fetch all holdings for all goal IDs at once
const allGoalIds = goals.map(g => g.id)
const holdingsByGoal = await this.goalRepo.findHoldingsByGoalIds(allGoalIds)

// 2. Collect unique price lookups needed
const priceKeys = new Set<string>()
for (const holdings of Object.values(holdingsByGoal)) {
  for (const h of holdings) {
    if (h.status !== 'SOLD') {
      priceKeys.add(`${h.brandCode}:${h.denominationGram}`)
    }
  }
}

// 3. Batch fetch all prices
const prices = await this.priceRepo.getLatestBuybackPrices([...priceKeys])
```

### Required changes:
1. Add `findHoldingsByGoalIds(goalIds: string[])` method to goal repository
2. Add `getLatestBuybackPrices(keys: string[])` method to price repository
3. Refactor loop to use cached maps instead of per-item queries

## Verification

- Build passes: `npm run build`
- Verify with database query logging that only 2-3 queries are made regardless of goal/holding count
- API response data is identical to before
