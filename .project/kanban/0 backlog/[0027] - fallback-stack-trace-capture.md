# PRD: Fallback Stack Trace Capture

## Category: Minor
## Severity: Minor
## Target File: `src/applications/shared/lib/errors.ts`

## Problem
`Error.captureStackTrace` is V8-specific. Calling it without checking for its existence can break the application in non-V8 runtimes (e.g., some browsers or Edge runtimes).

## Solution
Add runtime detection:
1. Wrap call in `if (typeof Error.captureStackTrace === 'function')`.
2. Provide a fallback: `this.stack = (new Error()).stack`.

## Verification
- Verify that errors still have useful stack traces in standard Node.js.
- Ensure the code doesn't crash if `captureStackTrace` is missing.
