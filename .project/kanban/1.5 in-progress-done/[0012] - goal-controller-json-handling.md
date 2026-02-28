# PRD: Handle Malformed JSON Body (GoalController)

## Category: Robustness
## Severity: Major
## Target File: `src/applications/modules/goals/v1/delivery/http/goal-controller.ts`

## Problem
Currently, `req.json()` is called directly without a try/catch. If the client sends malformed JSON, it throws a generic `SyntaxError`, resulting in a 500 Internal Server Error instead of a structured 400 Validation Error.

## Solution
Wrap `await req.json()` in a try/catch block. If a `SyntaxError` occurs, catch it and throw a `ValidationError('Invalid JSON body')` to ensure the controller returns a 400 with the standard error shape. Applied to both `createGoal` and `updateGoal`.

## Verification
- Send a POST/PUT request to goal endpoints with invalid JSON (e.g., missing closing brace).
- Verify the response is 400 Bad Request with a clear validation error message.
