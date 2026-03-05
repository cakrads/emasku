# [0001] Fix Financial Math in Buyback Simulation

**Priority:** CRITICAL
**Effort:** Small (4 files, ~15 operations)
**Category:** Bug / Data Integrity

---

## Problem

Frontend buyback simulation uses native JS `number` for financial arithmetic (`price * qty`, `pnl / cost * 100`). This violates the CLAUDE.md rule: _"All domain math MUST use `decimal.js`"_. Floating-point precision errors can produce incorrect IDR amounts on real transactions.

Backend already uses `decimal.js` correctly. The package is installed but never imported in frontend code.

## Files to Change

| File | Lines | Operations |
|------|-------|------------|
| `src/frontend/features/admin/buyback-simulation/hooks/use-buyback-simulation.ts` | 140-152 | `price * qty`, `+= cost`, `pnl / cost * 100` |
| `src/frontend/features/admin/buyback-simulation/components/simulation-breakdown.tsx` | 68-71 | `price * qty`, `pnl / cost * 100` |
| `src/frontend/features/admin/buyback-simulation/components/bulk-sell-modal.tsx` | 56-75 | `price * qty`, `+= total`, `pnl / cost * 100`, `toFixed(2)` |
| `src/frontend/view-model/portfolio.vm.ts` | — | `rawAvgBuyPrice: number` type (lower risk, display only) |

## Acceptance Criteria

- [ ] All price/cost/pnl arithmetic uses `Decimal` from `decimal.js`
- [ ] No native `number` multiplication/division on financial values
- [ ] `toFixed()` calls replaced with `Decimal.toFixed()`
- [ ] Existing behavior unchanged (values match before/after)
- [ ] `npm run build` passes
