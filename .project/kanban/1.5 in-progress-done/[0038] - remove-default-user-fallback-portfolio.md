# PRD: Remove Default User Fallback in Portfolio Summary

## Category: Duplicate
## Severity: Minor
## Target File: `src/applications/modules/portfolio/v1/usecases/get-portfolio-summary.ts`
## Lines: 37

## Problem
A default user fallback is used, which bypasses strict ownership checks and could expose data.

## Solution
1. Remove the default user fallback.
2. Throw an authentication error if the user is not identified.

## Verification
- Call portfolio summary without authentication.
- Verify request is rejected with 401/403 instead of returning data for a default user.
