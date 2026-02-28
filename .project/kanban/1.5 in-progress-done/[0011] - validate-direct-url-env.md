# PRD: Validate DIRECT_URL Environment Variable

## Category: Robustness
## Severity: Minor
## Target File: `src/applications/shared/scrapers/verify-logging.ts`

## Problem
In `verify-logging.ts`, the `DIRECT_URL` environment variable is used but not explicitly validated. If it's missing or set to the string "undefined", it can cause opaque database connection errors that are hard to debug.

## Solution
Add an explicit validation check for `DIRECT_URL` (and potentially other critical env vars used in this script) to ensure they are valid strings before attempting to use them in the database pool configuration.

## Verification
- Run the `verify-logging.ts` script without setting `DIRECT_URL`.
- Verify it fails with a clear error message about the missing environment variable instead of a generic connection error.
