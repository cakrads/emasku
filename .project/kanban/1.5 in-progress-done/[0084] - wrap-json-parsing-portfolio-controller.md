# [0084] Wrap JSON Parsing in Portfolio Controller

## Category
Input Validation

## Problem
In `portfolio-controller.ts`, four endpoints call `await req.json()` without a try/catch:
- `createHolding` (line ~156)
- `updateHolding` (line ~207)
- `sellHolding` (line ~252)
- `bulkSellHoldings` (line ~280)

If a client sends malformed JSON, this produces an unhandled 500 error instead of a 400 `ValidationError`.

The `GoalController` already wraps `req.json()` correctly — this should be applied consistently.

## Fix
Wrap each `await req.json()` in a try/catch that throws `ValidationError('Invalid JSON payload')`.

## Files
- `src/applications/modules/portfolio/v1/delivery/http/portfolio-controller.ts`
