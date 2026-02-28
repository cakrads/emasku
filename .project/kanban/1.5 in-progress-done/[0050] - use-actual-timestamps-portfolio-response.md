# PRD: Use Actual Timestamps in Portfolio Controller Responses

## Category: Minor
## Severity: Minor
## Target File: `src/applications/modules/portfolio/v1/delivery/http/portfolio-controller.ts`
## Lines: 185-186, 235-236

## Problem
The controller uses `new Date()` for `createdAt` and `updatedAt` in API responses instead of the actual record timestamps from the database.

## Solution
1. Use `record.createdAt` instead of `new Date()` at line 185-186.
2. Use `record.updatedAt` instead of `new Date()` at line 235-236.
3. Ensure the domain model exposes these timestamps.

## Verification
- Create or update a holding and check the API response.
- Verify `createdAt`/`updatedAt` match the actual database record timestamps.
