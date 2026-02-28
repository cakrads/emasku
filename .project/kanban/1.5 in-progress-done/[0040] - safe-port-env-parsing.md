# PRD: Safe PORT Environment Variable Parsing

## Category: Minor
## Severity: Minor
## Target File: `src/applications/shared/env.ts`
## Lines: 30

## Problem
Invalid or non-numeric `PORT` environment variable could cause runtime errors.

## Solution
1. Parse `PORT` with `parseInt` and validate the result.
2. Fall back to a default port (e.g., `3000`) if invalid.

## Verification
- Set `PORT` to a non-numeric value.
- Verify the application starts with the default port instead of crashing.
