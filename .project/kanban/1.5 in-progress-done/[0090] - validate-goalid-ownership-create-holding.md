# [0090] Validate Goal Ownership When Linking Holdings

## Category
Authorization & Security

## Problem
`UpdateHoldingUsecase` accepts `goalId` in the request and passes it directly to the repository
without verifying that the goal belongs to the requesting user. A user could link their holding
to another user's goal by providing a valid but unauthorized `goalId`.

`CreateHoldingUsecase` already validates goal ownership — `UpdateHoldingUsecase` should match.

## Fix
In `UpdateHoldingUsecase`, if `request.goalId` is provided (and not null), fetch the goal
and verify `goal.userId === userId` before proceeding. Throw `NotFoundError` if validation fails.

## Files
- `src/applications/modules/portfolio/v1/usecases/update-holding.usecase.ts`
