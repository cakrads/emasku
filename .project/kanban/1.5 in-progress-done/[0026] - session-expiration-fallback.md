# PRD: Fallback for Session Expiration

## Category: Minor
## Severity: Minor
## Target File: `src/applications/shared/auth/auth.service.ts`

## Problem
In `mapSession`, `expiresAt` defaults to 0 if `session.expires_at` is undefined. This makes the session immediately appear expired to consuming code.

## Solution
Provide a sensible fallback:
1. If `expires_at` is missing, set a computed future timestamp (e.g., `Date.now() + 24h`).
2. Alternatively, set to `null` and ensure downstream consumers handle the absence explicitly.

## Verification
- Mock a session with no expiration field.
- Verify it is mapped to a valid future date/null instead of `0`.
