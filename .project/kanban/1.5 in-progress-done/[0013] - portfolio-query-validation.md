# PRD: Validate Portfolio Query Params

## Category: Robustness / Security
## Severity: Major
## Target File: `src/applications/modules/portfolio/v1/delivery/http/portfolio-controller.ts`

## Problem
Query parameters like `dateFrom`, `dateTo`, `page`, and `pageSize` are parsed manually without strict validation. This can lead to unexpected behavior or database errors if invalid types are provided.

## Solution
Implement strict validation for incoming query parameters:
1. Validate `dateFrom` and `dateTo` are valid ISO dates.
2. Ensure `page` and `pageSize` are positive integers with sane defaults.
3. Validate `status` is one of `active`, `sold`, or `all`.
4. Ensure `brandCodes` (from comma-separated string) contains valid, non-empty codes.
5. Short-circuit with a 400 BadRequest if validation fails.

## Verification
- Request `/api/v1/portfolio` with invalid dates or negative page numbers.
- Verify 400 response with descriptive error messages.
