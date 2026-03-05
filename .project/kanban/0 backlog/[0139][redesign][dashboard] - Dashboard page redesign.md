# [0139][redesign][dashboard] Dashboard Page Redesign

**Severity**: High
**Category**: Frontend / Redesign
**Estimated Effort**: Large
**Depends On**: `[0135]` tokens, `[0136]` components, `[0137]` navigation, `[0138]` fragments

## Context

> Read `.project/redesign-context.md` for full design direction and reference images.
>
> **Primary reference**: `Wise iOS 42.png` (mobile home), `Wise Web 24.png` (web dashboard), `Wise Android 38.png` (mobile account view)

## Description

Redesign the dashboard page — the most visible admin page — to match the Wise-inspired clean financial UI. The dashboard is the first thing users see after login.

## Current State

**View file**: `src/frontend/features/admin/dashboard/dashboard-view.tsx`
**Sub-components**: 16 files in `./components/`

Currently uses `PageWrapper` + `Container` (not `StandardPageLayout`). Renders: portfolio hero, goals section, prices today cards, brand breakdown, holdings preview, and a floating FAB.

## Target Design

### Layout (top to bottom)

1. **Greeting + Privacy Toggle**
   - Left: "Portfolio" or user's name as section heading
   - Right: eye icon toggle (privacy) + freshness indicator

2. **Hero Value**
   - Total portfolio value in `Typography display` variant (text-4xl bold)
   - PnL below: `+Rp 1.234.567 (+12.5%)` in green or red, `Typography body-sm`
   - Period tabs: Today / Week / Month / Year — as small underlined text tabs, NOT pill buttons

3. **Quick Actions Row**
   - Horizontal row of `ActionChip` components:
     - "Tambah Emas" (primary/gold, plus icon)
     - "Jual" (outline, arrow-up icon)
     - "Riwayat Harga" (outline, chart icon)
   - Scrollable on mobile if needed

4. **Market Today Section**
   - `SectionHeader`: "Harga Emas Hari Ini" + optional "See all" link
   - Horizontal scroll row of brand price cards
   - Each card: brand name + buy price + sell price + daily change badge

5. **Brand Breakdown Section**
   - `SectionHeader`: "Kepemilikan" (or "Brand Allocation")
   - 2-column card grid (like Wise currency cards)
   - Each card: brand icon/logo top, total weight (gram) as value, current value as subtitle

6. **Recent Holdings Section**
   - `SectionHeader`: "Kepemilikan Terbaru" + "See all" link → `/holdings`
   - 5 most recent holdings as `ListRow` components
   - Each row: brand icon + brand name + weight left, current value + PnL right

7. **Goals Section**
   - `SectionHeader`: "Goals" + "See all" link → `/goals`
   - Progress cards for active goals

### Empty State

When no holdings exist, show a centered empty state with:
- Illustration or muted icon
- "Mulai investasi emas pertamamu"
- Gold CTA button → `/holdings/create`

## Scope

- [ ] Rewrite `dashboard-view.tsx` with new layout structure
- [ ] Rewrite or create sub-components as needed (most existing ones will need updates)
- [ ] Use the new shared components: `SectionHeader`, `ActionChip`, `ListRow`, `StatCard`
- [ ] Maintain all existing data fetching and view-model logic — only change the UI layer
- [ ] Keep skeleton loading states (update to match new layout)
- [ ] Keep `ErrorBoundary` wrapping around each section

## Acceptance Criteria

- Dashboard renders with clean Wise-inspired layout on mobile and desktop
- All data displays correctly (portfolio value, PnL, prices, holdings)
- Privacy toggle works (hides/shows values)
- Quick action chips navigate to correct pages
- Empty state renders when no holdings
- Skeleton states match new layout
- `npm run build` passes
- `npm run lint` passes

## Files Modified

- `src/frontend/features/admin/dashboard/dashboard-view.tsx` (major rewrite)
- `src/frontend/features/admin/dashboard/components/*.tsx` (most files updated)
