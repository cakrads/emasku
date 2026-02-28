# [0088] Batch Price Queries in Goal Detail Usecase

## Category
Performance

## Problem
`GetGoalDetailUsecase.execute()` fetches prices in a `Promise.all()` map, but each holding
makes an individual `getLatestBuybackPrice()` call. For goals with many active holdings, this
results in N individual DB queries (N+1 pattern via parallel awaits).

The portfolio module already uses `getLatestBuybackPrices()` (batch) to fetch prices for
multiple brand:gram keys in a single query.

## Fix
1. Collect all unique `brandCode:denominationGram` keys from active holdings.
2. Call `getLatestBuybackPrices(keys)` once.
3. Look up each holding's price from the result map.

## Files
- `src/applications/modules/goals/v1/usecases/get-goal-detail.usecase.ts`
