# [0003] Add ErrorBoundary to Public Pages

**Priority:** Medium
**Effort:** Small (3 pages)
**Category:** Reliability

---

## Problem

Public pages have no error protection. If a component throws, the entire page crashes with no recovery.

Already covered: `prices-list-view.tsx`, `prices-history-view.tsx`.

## Pages Missing ErrorBoundary

- `src/frontend/features/public/landing/landing-view.tsx`
- `src/frontend/features/public/login/login-view.tsx`
- `src/frontend/features/public/privacy/privacy-view.tsx`

## Action

- Consider creating `src/frontend/components/fragments/public/error-boundary.tsx` (or reuse the admin one)
- Wrap each view with the ErrorBoundary component

## Acceptance Criteria

- [ ] All public page views wrapped with ErrorBoundary
- [ ] Error state shows user-friendly fallback UI
- [ ] `npm run build` passes
