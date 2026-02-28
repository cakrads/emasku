# PRD: Validate Supabase Environment Variables

## Category: Minor
## Severity: Minor
## Target File: `src/applications/shared/auth/supabase.client.ts`
## Lines: 14-16

## Problem
Missing Supabase environment variables cause silent failures at runtime.

## Solution
1. Add startup validation for `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
2. Throw a descriptive error if either is missing.

## Verification
- Remove one of the Supabase env vars.
- Verify the app throws a clear error on startup.
