# [0004] Add Suspense Fallback to Holdings Page

**Priority:** Medium
**Effort:** Tiny (1 file)
**Category:** UX

---

## Problem

`src/app/(admin)/holdings/page.tsx` line 6 has `<Suspense>` without a `fallback` prop. User sees nothing while the component loads. Other pages do this correctly.

## Action

Add `fallback={<LoadingSkeleton />}` or appropriate loading UI.

## Acceptance Criteria

- [ ] `<Suspense>` in holdings page has a fallback prop
- [ ] Loading state is visible during component load
- [ ] `npm run build` passes
