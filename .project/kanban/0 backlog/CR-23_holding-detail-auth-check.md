---
title: "Add user authorization to getHoldingDetail"
severity: critical
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/modules/portfolio/v1/delivery/http/portfolio-controller.ts"
lines: "115-135"
status: backlog
created: 2026-02-28
---

# Add user authorization to getHoldingDetail

## Problem

Unlike other handlers that call `verifyUser(req)`, `getHoldingDetail` only accepts an `id` parameter and doesn't verify that the authenticated user owns the requested holding. **Any authenticated user can access any holding by guessing/enumerating IDs.**

## Solution

Add `verifyUser(req)` and pass `userId` to the usecase for ownership verification.

### In `portfolio-controller.ts`:
```diff
-async getHoldingDetail(id: string): Promise<NextResponse> {
+async getHoldingDetail(req: NextRequest, id: string): Promise<NextResponse> {
+  const userId = await verifyUser(req)
   const usecase = new GetHoldingDetailUsecase()
-  const holding = await usecase.execute(id)
+  const holding = await usecase.execute(id, userId)
   if (!holding) {
```

### In `GetHoldingDetailUsecase`:
Update `execute` to accept and verify `userId` against the holding's owner. Return null or throw Forbidden if the user doesn't own the holding.

### In the route handler:
Update the route to pass `req` to `getHoldingDetail`.

## Verification

- Build passes: `npm run build`
- Request holding owned by another user → 403/404
- Request own holding → returns data normally
- All existing tests updated to pass userId
