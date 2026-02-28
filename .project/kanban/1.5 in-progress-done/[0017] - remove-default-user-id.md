# PRD: Remove Default userId Security Risk

## Category: Security
## Severity: Major
## Target Files: 
- `src/applications/modules/portfolio/v1/usecases/get-portfolio-holdings.ts`
- `src/applications/modules/portfolio/v1/usecases/get-portfolio-summary.ts`

## Problem
The `execute` method in these usecases accepts a hardcoded `'default-user-id'`, which is a security risk and can lead to data leaks if callers forget to provide the authenticated ID.

## Solution
1. Remove the default value from `userId` in function signatures.
2. Add a runtime guard: `if (!userId) throw new Error('userId is required')`.
3. Update any callers/tests that relied on the default.

## Verification
- Run a full build to find any callers missing the `userId` parameter.
- Verify that providing an empty/null `userId` results in an immediate error.
