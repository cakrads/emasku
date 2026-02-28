# PRD: Avoid Truthy Check for Sell Price

## Category: Minor
## Severity: Minor
## Target File: `src/applications/modules/goals/v1/usecases/list-goals.usecase.ts`
## Lines: 57

## Problem
Truthy check for `sellPrice` incorrectly skips zero-valued sell prices.

## Solution
1. Replace truthy check with `!== undefined && !== null` check.

## Verification
- Create a goal with `sellPrice: 0`.
- Verify it is processed correctly and not skipped.
