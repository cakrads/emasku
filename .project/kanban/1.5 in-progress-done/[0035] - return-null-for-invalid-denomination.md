# PRD: Return Null for Invalid Denomination

## Category: Duplicate
## Severity: Minor
## Target File: `src/applications/modules/portfolio/v1/usecases/get-holding-detail.ts`
## Lines: 62-69

## Problem
When a denomination is invalid, the code returns `0` instead of `null`, misleading the client into thinking the value is zero.

## Solution
1. Return `null` when the denomination is invalid or unrecognized.
2. Update client-side handling to distinguish `null` (unknown) from `0` (actual zero).

## Verification
- Request holding detail with an invalid denomination.
- Verify the response contains `null` instead of `0`.
