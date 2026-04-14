# [0146][chore][buyback] Fix pre-existing arbitrary Tailwind values in buyback components

**Severity**: Low
**Category**: Frontend / Code Quality
**Estimated Effort**: XSmall
**Noted In**: PR #13 review by @claude

## Context

These violations were already present on the base branch before PR #13 (`feat/redesign-0143-0145`) touched these files. Out of scope for that PR but worth cleaning up.

## Files & Lines

| File | Line(s) | Violation |
|---|---|---|
| `src/frontend/features/admin/buyback-simulation/components/header-summary.tsx` | ~62, ~72, ~82 | `text-[10px]` used for label typography |
| `src/frontend/features/admin/buyback-simulation/components/floating-summary-bar.tsx` | ~66 | `text-[10px]` used for the count badge |

## Fix

Replace all `text-[10px]` occurrences with `text-xs` (12px — the nearest scale step, visually close enough and a proper design-system token).

## Scope

- [ ] `header-summary.tsx` — replace `text-[10px]` with `text-xs` on lines ~62, ~72, ~82
- [ ] `floating-summary-bar.tsx` — replace `text-[10px]` with `text-xs` on line ~66
- [ ] `npm run build` passes

## Acceptance Criteria

- No `text-[10px]` remaining in buyback simulation components
- Visual appearance unchanged (or negligibly different — 10px vs 12px is acceptable)
- `npm run build` passes
