# [0145][redesign][buyback] Buyback Simulation Page Redesign

**Severity**: Low
**Category**: Frontend / Redesign
**Estimated Effort**: Medium
**Depends On**: `[0135]` tokens, `[0136]` components

## Context

> Read `.project/redesign-context.md` for full design direction and reference images.

## Description

Redesign the buyback simulation tool for a cleaner look with better mobile UX.

## Current State

**View file**: `src/frontend/features/admin/buyback-simulation/buyback-simulation-view.tsx`
**Sub-components**: 6 files in `./components/` + 1 hook

Interactive tool: select holdings → override quantities → see breakdown → confirm bulk sell.

## Target Design

1. **Page Header**: `StandardPageLayout` + description subtitle
2. **Selection List**:
   - Mobile: Clean cards with checkbox, brand + weight, value + PnL
   - Desktop: Clean table with checkboxes
   - Selected items get a subtle gold border/highlight
3. **Summary Bar** (mobile): Sticky bottom bar with selected count + total proceeds
4. **Breakdown Sidebar** (desktop): Clean card with itemized list + total
5. **Confirmation Modal**: Clean summary of selected items + gold "Confirm Sell" button

## Scope

- [ ] Update view and sub-components with new styling
- [ ] Maintain all selection, quantity override, and bulk sell logic
- [ ] Update floating summary bar for mobile

## Acceptance Criteria

- Simulation works correctly end-to-end
- Selection and quantity overrides function properly
- Bulk sell creates correct API calls
- `npm run build` passes

## Files Modified

- `src/frontend/features/admin/buyback-simulation/buyback-simulation-view.tsx`
- `src/frontend/features/admin/buyback-simulation/components/*.tsx`
