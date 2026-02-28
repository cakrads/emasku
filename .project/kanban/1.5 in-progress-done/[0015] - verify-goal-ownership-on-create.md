# PRD: Verify Goal Ownership on Creation

## Category: Security
## Severity: Critical
## Target File: `src/applications/modules/portfolio/v1/usecases/create-holding.usecase.ts`

## Problem
When creating a holding with a `goalId`, the system does not verify if the goal belongs to the user. A user could potentially link their holding to another user's goal.

## Solution
In `CreateHoldingUsecase.execute`:
1. If `request.goalId` is provided, load the goal using `goalRepo.findById`.
2. Verify that `goal.userId === authenticatedUserId`.
3. If the goal doesn't exist or ownership fails, throw a `ForbiddenError` (or `NotFoundError` to avoid leaking presence).

## Verification
- Attempt to create a holding with a `goalId` belonging to a different user.
- Verify the request is rejected with an appropriate error.
