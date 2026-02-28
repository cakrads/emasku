# PRD: Capture execSync Errors in verify-logging

## Category: Nitpick
## Severity: Trivial
## Target File: `src/applications/shared/scrapers/verify-logging.ts`

## Problem
The catch block for `execSync` is currently empty, which swallows the error and makes it hard to debug why the scraper failed.

## Solution
1. Capture the error in the `catch` block (`catch (err)`).
2. Log the error message or stack to `console.error`.

## Verification
- Temporarily force the scraper to fail (e.g., provide an invalid script name).
- Run `verify-logging` and ensure the specific error output from `execSync` is displayed.
