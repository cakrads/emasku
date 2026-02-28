# PRD: Add Safety Check for pageSize Zero in Pagination

## Category: Minor
## Severity: Minor
## Target File: `src/applications/modules/portfolio/v1/usecases/get-portfolio-holdings.ts`
## Lines: 104-106

## Problem
`pageSize: 0` causes division-by-zero errors in pagination logic.

## Solution
1. Validate `pageSize` is greater than 0.
2. Default to a sensible page size (e.g., 10) or return an error.

## Verification
- Request holdings with `pageSize: 0`.
- Verify no division-by-zero error occurs.
