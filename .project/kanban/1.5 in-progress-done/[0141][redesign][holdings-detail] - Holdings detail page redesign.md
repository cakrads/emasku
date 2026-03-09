# [0141][redesign][holdings-detail] Holdings Detail Page Redesign

**Severity**: Medium
**Category**: Frontend / Redesign
**Estimated Effort**: Medium
**Depends On**: `[0135]` tokens, `[0136]` components

## Context

> Read `.project/redesign-context.md` for full design direction and reference images.
>
> **Primary reference**: `Wise iOS 180.png` (transaction detail with timeline), `WhatsApp Image ... (1).jpeg` (Bank Jago detail with action buttons)

## Description

Redesign the holding detail page for a cleaner look with a hero value section, clean info cards, and compact action buttons.

## Current State

**View file**: `src/frontend/features/admin/holdings-detail/holding-detail-view.tsx`
**Sub-components**: 5 files in `./components/` + 1 hook

Shows a hero section (current value + PnL), purchase details card, sell info card (if sold), valuation card (if active), and action buttons (mark sold, delete).

## Target Design

1. **Hero Section**
   - Large value display (Typography `display` variant)
   - PnL badge below with semantic color
   - Status badge: "Active" (green) or "Sold" (muted)

2. **Info Cards** (stacked, clean, rounded-xl)
   - Purchase Details: brand, weight, buy price, date, notes, goal link
   - Current Valuation (active): buyback price, current value, unrealized PnL
   - Sell Info (sold): sell price, sell date, realized PnL
   - Each card uses `SectionHeader`-style label + clean key-value rows

3. **Action Buttons**
   - Compact pill buttons in a horizontal row (not full-width):
     - "Edit" (outline), "Mark as Sold" (warning outline), "Delete" (error ghost)
   - Or at the bottom as `detail-actions` pattern

## Scope

- [ ] Rewrite `holding-detail-view.tsx` with new layout
- [ ] Update info card components to use clean Card + Typography patterns
- [ ] Update sell modal styling
- [ ] Update skeleton to match new layout
- [ ] Maintain all mutation logic (sell, delete)

## Acceptance Criteria

- Detail page renders cleanly for both active and sold holdings
- Sell and delete actions work correctly
- `npm run build` passes

## Files Modified

- `src/frontend/features/admin/holdings-detail/holding-detail-view.tsx`
- `src/frontend/features/admin/holdings-detail/components/*.tsx`
