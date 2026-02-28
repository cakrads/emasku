# PRD: Fix Timezone Mismatch in Goal Date Validation

## Category: Minor
## Severity: Minor
## Target File: `src/applications/modules/goals/v1/usecases/create-goal.usecase.ts`
## Lines: 19-29

## Problem
`targetDate` uses UTC while `today` uses local time, causing incorrect date comparisons near midnight.

## Solution
1. Normalize both dates to the same timezone (UTC or WIB) before comparison.
2. Consider using a date library for consistent handling.

## Verification
- Create a goal with a target date near midnight boundary.
- Verify validation works correctly regardless of timezone.
