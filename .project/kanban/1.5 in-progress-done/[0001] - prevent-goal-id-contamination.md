# PRD: Prevent Goal ID Contamination

## Category: Security/Privacy
## Severity: Critical
## Target File: `src/applications/modules/portfolio/v1/usecases/create-holding.usecase.ts`

## Problem
The `createHolding` usecase forwards the `goalId` from the request directly to the persistence layer without verifying if the authenticated user owns the goal. This allows a user to link their gold holding to a goal belonging to another user, leading to data contamination and potential unauthorized information leak in goal summary reports.

## Solution
Add a check in the `CreateHoldingUsecase` to verify goal ownership:
1. Fetch the goal by `goalId` if provided.
2. Verify that `goal.userId === authenticatedUserId`.
3. If the goal exists but belongs to another user, throw an `UnauthorizedError` or `NotFoundError`.

## Verification
- Attempt to create a holding with a `goalId` that belongs to a different user.
- Verify that the API returns an error and does not create the holding linked to that goal.
- Create a holding with a valid `goalId` belonging to the same user and verify success.
