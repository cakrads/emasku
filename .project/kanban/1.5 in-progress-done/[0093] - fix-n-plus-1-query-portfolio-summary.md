# [0093] Fix N+1 Query in Portfolio Summary

## Category
Performance — 🟠 Major

## Problem
`get-portfolio-summary.ts` calls `this.getValuation(holding)` inside a `Promise.all(map(...))`,
executing one `getLatestBuybackPrice()` query per holding (N+1 pattern).

The batch method `getLatestBuybackPrices()` already exists and is used correctly in
`list-goals.usecase.ts` and (now) `get-goal-detail.usecase.ts`.

## Impact
- 50 holdings = 50 DB round-trips instead of 1
- Latency scales linearly with portfolio size
- Connection pool exhaustion under load

## Fix
1. Collect all `brandCode:denominationGram` keys from active holdings upfront
2. Call `getLatestBuybackPrices(keys)` once
3. Refactor `getValuation()` to accept the price map and compute synchronously

## Files
- `src/applications/modules/portfolio/v1/usecases/get-portfolio-summary.ts`
