# PRD: Validate DATABASE_URL Before Pool Creation

## Category: Minor
## Severity: Minor
## Target File: `src/applications/shared/persistence/prisma-client.ts`

## Problem
A `pg.Pool` is created using `process.env.DATABASE_URL` without prior validation. If the environment variable is missing, it passes `undefined` to `pg.Pool`, which can lead to cryptic errors during initialization.

## Solution
1. Add a check: `if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing')`.
2. Ensure the error message is clear and names the missing variable.
3. Throw before constructing the `new pg.Pool`.

## Verification
- Temporarily remove `DATABASE_URL` from `.env`.
- Verify the process fails immediately with a descriptive error.
