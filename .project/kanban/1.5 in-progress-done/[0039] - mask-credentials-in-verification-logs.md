# PRD: Mask Credentials in Verification Logs

## Category: Minor
## Severity: Minor (Security)
## Target File: `src/applications/shared/auth/verify-logging.ts`
## Lines: 38-42

## Problem
Passwords/tokens may be logged in plain text during verification, creating a security risk.

## Solution
1. Identify sensitive fields (password, token, secret).
2. Mask them before logging (e.g., `***`).

## Verification
- Trigger verification logging with sensitive data.
- Verify logs do not contain plain-text credentials.
