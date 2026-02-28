# PRD: Adjust Production Log Level

## Category: Robustness
## Severity: Major
## Target File: `src/applications/shared/lib/logger.ts`

## Problem
The system uses `logger.http()` for request logging. However, in production, the log level is often set to `info`. Since `http` is a custom level defined as higher than `info` (lower priority), many logging providers (like Winston) will ignore these logs if the level is set to `info`.

## Solution
1. Change request logging in the middleware/wrapper to use `logger.info()` instead of `logger.http()`.
2. Alternatively, adjust the production log level configuration to `http` or ensure the custom logging levels are correctly prioritized in the Winston configuration.

## Verification
- Run the application with `NODE_ENV=production` and `LOG_LEVEL=info`.
- Verify that request/response logs are appearing in the output.
