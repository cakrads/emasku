# [0081] - Validate targetDate string before conversion

**Source:** PR #4 CodeRabbit Review (Minor)

**Problem:**
`UpdateGoalUsecase` converts `request.targetDate` to a `Date` without validating it first.

**Details:**
- File: `src/applications/modules/goals/v1/usecases/update-goal.usecase.ts`
- Action Required: Check if the string forms a valid date `!isNaN(new Date().getTime())` before blindly assigning.
