# PRD: Use Previous Record for Price Deltas

## Category: Duplicate
## Severity: Minor
## Target File: `src/applications/shared/persistence/prisma-price-repository.ts`
## Lines: 128-141

## Problem
Price delta calculation uses a fixed window instead of the immediate previous record, which can produce inaccurate results.

## Solution
1. Query the most recent price record prior to the current one.
2. Compute the delta against that record instead of a fixed time window.

## Verification
- Insert multiple price records with known values.
- Verify delta is computed against the immediately preceding record.
