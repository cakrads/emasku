# [0140][redesign][holdings-list] Holdings List Page Redesign

**Severity**: High
**Category**: Frontend / Redesign
**Estimated Effort**: Large
**Depends On**: `[0135]` tokens, `[0136]` components, `[0137]` navigation

## Context

> Read `.project/redesign-context.md` for full design direction and reference images.
>
> **Primary reference**: `Wise Web 24.png` (clean list with filter chips), `Wise Android 38.png` (mobile transaction list)

## Description

Redesign the holdings list page for a cleaner, Wise-inspired look with chip-based filters, compact summary metrics, and clean list rows.

## Current State

**View file**: `src/frontend/features/admin/holdings-list/holdings-list-view.tsx`
**Sub-components**: 9 files in `./components/`

Currently uses `StandardPageLayout`, URL-synced filters, portfolio summary section, filter bar/modal, and a data table with pagination.

## Target Design

### Layout (top to bottom)

1. **Page Header**
   - `StandardPageLayout` with breadcrumbs + title "Holdings"
   - Action slot: "Add Holding" button (gold, compact)

2. **Portfolio Summary Bar**
   - Horizontal row of 4 `StatCard` components:
     - Total Weight (gram), Total Buy Value, Current Value, Total PnL
   - Scrollable on mobile

3. **Filter Row**
   - Chip-based inline filters (like Wise's "All" / "Interest" tabs):
     - Status: All / Active / Sold (pill chips, selected = filled, unselected = outline)
     - Brand filter: dropdown or chip
     - Sort: dropdown
   - On mobile: same chips row, scrollable horizontally
   - Remove the full-screen filter modal — inline chips are sufficient

4. **Holdings List**
   - **Mobile**: `ListRow` components with:
     - Leading: brand icon circle
     - Title: brand name, Subtitle: weight + purchase date
     - Trailing: current value, Trailing subtitle: PnL with color
   - **Desktop**: Clean table with columns: Date (hold duration), Brand + Weight, Buy Price, Current Value, PnL
   - Dividers between rows
   - Click navigates to holding detail

5. **Pagination**
   - Simple, compact pagination controls at the bottom

### Empty State

- Centered empty state with "No holdings yet" message
- Gold CTA → `/holdings/create`

## Scope

- [ ] Update `holdings-list-view.tsx` with new layout
- [ ] Replace filter modal with inline chip-based filters
- [ ] Update portfolio summary section to use `StatCard` components
- [ ] Update or replace table component with `ListRow` for mobile
- [ ] Update skeleton to match new layout
- [ ] Maintain all URL-synced filter state logic

## Acceptance Criteria

- Holdings list renders cleanly on both mobile and desktop
- Filters work correctly (brand, status, sort)
- Pagination works
- Summary metrics display correct values
- Navigation to holding detail works
- Empty state shows when no holdings
- `npm run build` passes

## Files Modified

- `src/frontend/features/admin/holdings-list/holdings-list-view.tsx`
- `src/frontend/features/admin/holdings-list/components/*.tsx`
