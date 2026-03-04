# Fix Division by Zero in Sell Modal PnL Calculation

**Source:** CodeRabbit FE Review #3 — Issue #3
**Severity:** HIGH
**Type:** Bug Fix (runtime crash prevention)

## Problem

`src/frontend/features/admin/holdings-detail/components/sell-modal.tsx` computes:
```tsx
((sellPriceNum - buyPriceNum) / buyPriceNum) * 100
```

If `buyPriceNum` is 0 (holding recorded with zero buy price), this produces `Infinity` or `NaN`, rendering as blank or `"Infinity%"` in the UI.

## Fix

```tsx
const pnlPercent = buyPriceNum > 0
  ? ((sellPriceNum - buyPriceNum) / buyPriceNum) * 100
  : null
```

Display `null` as "N/A" instead of a computed percentage.

## Files

- `src/frontend/features/admin/holdings-detail/components/sell-modal.tsx`
