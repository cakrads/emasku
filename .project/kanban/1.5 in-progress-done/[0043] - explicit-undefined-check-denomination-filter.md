# PRD: Use Explicit Undefined Check for Denomination Filter

## Category: Minor
## Severity: Minor
## Target File: `src/applications/modules/prices/v1/usecases/get-today-prices.ts`
## Lines: 23

## Problem
Truthy check on denomination filter incorrectly excludes `0` as a valid filter value.

## Solution
1. Replace truthy check with explicit `!== undefined` check.

## Verification
- Filter prices with denomination `0`.
- Verify results include denomination-0 entries.
