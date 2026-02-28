# [0095] Race Condition in Goal Completion

## Category
Concurrency — 🔴 Critical

## Problem
Goal completion value calculation in `update-goal.usecase.ts` is not atomic.
Holdings are fetched and prices computed outside any transaction, then
`completedValue` is written. A concurrent sell/modify between read and write
invalidates the snapshot.

## Fix
Wrap the entire completion flow (re-fetch goal, fetch holdings, calculate value,
update goal) in a single `prisma.$transaction`.

## Files
- `src/applications/modules/goals/v1/usecases/update-goal.usecase.ts`
