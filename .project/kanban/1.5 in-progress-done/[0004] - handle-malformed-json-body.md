# PRD: Handle Malformed JSON Body

## Category: Robustness
## Severity: Major
## Target File: `src/applications/modules/goals/v1/delivery/http/goal-controller.ts`

## Problem
In `goal-controller.ts`, `req.json()` is awaited without a `try/catch` wrapper. If the client sends malformed JSON, the framework will throw an unhandled exception, resulting in a 500 Internal Server Error. It should instead return a clear 400 Bad Request error.

## Solution
Wrap `req.json()` in a `try/catch` block:
```typescript
try {
  const body = await req.json();
} catch (e) {
  throw new ValidationError('Invalid JSON payload');
}
```

## Verification
- Send a request to the goal endpoints with invalid JSON (e.g., missing quotes, trailing commas).
- Verify the response is 400 with a clear error message.
- Verify that valid JSON still works correctly.
