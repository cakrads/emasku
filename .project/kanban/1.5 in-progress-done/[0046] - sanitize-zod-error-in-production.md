# PRD: Sanitize ZodError Output in Production

## Category: Minor
## Severity: Minor (Security)
## Target File: `src/applications/shared/lib/response.ts`
## Lines: 94-110

## Problem
`ZodError` details are exposed to clients in production, leaking internal schema structures.

## Solution
1. In production, return a generic validation error message.
2. In development, return full Zod error details.

## Verification
- Trigger a validation error in production mode.
- Verify the response contains a generic message, not schema details.
