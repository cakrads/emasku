# PRD: Bound Buyback Request Items

## Category: Performance / Security
## Severity: Minor
## Target File: `src/applications/modules/prices/v1/delivery/http/buyback-controller.ts`

## Problem
The controller accepts an unbounded list of items, which could be used to trigger oversized database queries (N+1 or massive `IN` clauses).

## Solution
Enforce an upper bound (e.g., `MAX_ITEMS = 100`):
1. After parsing the comma-separated list, check `items.length`.
2. Throw a `ValidationError` if it exceeds the limit.

## Verification
- Send a request with > 100 items.
- Verify 400 response with a clear limit message.
