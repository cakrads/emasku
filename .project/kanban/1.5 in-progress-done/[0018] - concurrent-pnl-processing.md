# PRD: Concurrent PnL Processing (Portfolio Summary)

## Category: Performance
## Severity: Major
## Target File: `src/applications/modules/portfolio/v1/usecases/get-portfolio-summary.ts`

## Problem
Processing periodic PnL for each holding sequentially in a loop causes linear latency. Additionally, in-place mutation of shared state inside the loop is risky for parallelization.

## Solution
1. Refactor `processPeriodicPnLForHolding` to return a result object instead of mutating state.
2. Use `Promise.all` to process all holdings concurrently.
3. Accumulate deltas and merge PnL arrays after the parallel run.

## Verification
- Compare latency before/after on a large portfolio.
- Verify that total PnL remains identical across multiple runs.
