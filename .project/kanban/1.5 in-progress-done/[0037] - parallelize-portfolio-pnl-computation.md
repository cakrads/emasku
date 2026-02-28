# PRD: Parallelize Portfolio PnL Computation

## Category: Duplicate
## Severity: Minor
## Target File: `src/applications/modules/portfolio/v1/usecases/get-portfolio-summary.ts`
## Lines: 76-93

## Problem
Per-holding PnL calculations run sequentially, degrading performance as holdings grow.

## Solution
1. Replace sequential `for` loop with `Promise.all` for parallel execution.
2. Ensure error handling still captures individual holding failures.

## Verification
- Load a portfolio with multiple holdings.
- Verify summary computes correctly and faster with parallel execution.
