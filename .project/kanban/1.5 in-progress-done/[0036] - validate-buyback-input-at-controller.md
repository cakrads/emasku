# PRD: Validate Buyback Input at Controller Level

## Category: Duplicate
## Severity: Minor
## Target File: `src/applications/modules/portfolio/v1/delivery/http/buyback-controller.ts`
## Lines: 28-52

## Problem
Input items for buyback are passed to the use case without strict validation at the controller level.

## Solution
1. Add Zod or manual validation for input items (bound checks, required fields).
2. Return `400 Bad Request` for invalid payloads before reaching the use case.

## Verification
- Send a buyback request with missing/invalid items.
- Verify a 400 error is returned with descriptive validation messages.
