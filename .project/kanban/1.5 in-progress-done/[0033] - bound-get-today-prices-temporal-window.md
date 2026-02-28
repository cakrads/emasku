# PRD: Bound getTodayPrices to Today's Temporal Window

## Category: Duplicate
## Severity: Minor
## Target File: `src/applications/shared/persistence/prisma-price-repository.ts`
## Lines: 88-95

## Problem
`getTodayPrices` is not explicitly bounded to today's date range (00:00:00–23:59:59), which may fetch stale data.

## Solution
1. Add explicit start-of-day and end-of-day boundaries to the query.
2. Use UTC or configured timezone consistently.

## Verification
- Call `getTodayPrices` and verify only today's records are returned.
- Ensure no data from previous days leaks through.
