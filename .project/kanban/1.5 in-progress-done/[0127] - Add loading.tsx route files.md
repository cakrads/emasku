# [0007] Add loading.tsx Route Files

**Priority:** Low
**Effort:** Small
**Category:** UX

---

## Problem

No `loading.tsx` files exist in `src/app/`. Pages rely on inline `<Suspense>` boundaries which is fragile. Next.js `loading.tsx` convention provides automatic route-level loading states.

## Action

Add `loading.tsx` to key route groups:
- `src/app/(admin)/loading.tsx`
- `src/app/(public)/loading.tsx`
- `src/app/(auth)/loading.tsx`

## Acceptance Criteria

- [ ] `loading.tsx` exists in each route group
- [ ] Loading states show appropriate skeleton/spinner UI
- [ ] `npm run build` passes
