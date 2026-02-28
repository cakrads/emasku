# PRD: Validate Portfolio Query Params

## Category: Robustness
## Severity: Major
## Target File: `src/applications/modules/portfolio/v1/delivery/http/portfolio-controller.ts`

## Problem
Query parameters like `dateFrom`, `dateTo`, `page`, and `pageSize` are parsed from the URL but not strictly validated before being passed to usecases and repositories. Invalid dates or negative page numbers can cause 500 errors in the database layer.

## Solution
Implement strict validation for query parameters in the controller:
1. Use Zod to validate the search params after extracting them.
2. Ensure `page` and `pageSize` are positive integers.
3. Ensure `dateFrom` and `dateTo` are valid ISO dates.

## Verification
- Send requests with invalid query params (e.g., `?page=-1`, `?dateFrom=invalid`).
- Verify the API returns a 400 Validation Error.
