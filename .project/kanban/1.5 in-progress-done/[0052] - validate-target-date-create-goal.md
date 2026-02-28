# [0052] - Validate target date create goal

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
Malformed date strings bypass the current past-date check and can fail later during persistence.

**Details:**
- File: `src/applications/modules/goals/v1/usecases/create-goal.usecase.ts`

**Action Required:**
Verify the parsed Date is valid `!isNaN(targetDate.getTime())`. If invalid, throw a ValidationError with field error for targetDate.
