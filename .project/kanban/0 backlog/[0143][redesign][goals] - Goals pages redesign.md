# [0143][redesign][goals] Goals Pages Redesign

**Severity**: Medium
**Category**: Frontend / Redesign
**Estimated Effort**: Large
**Depends On**: `[0135]` tokens, `[0136]` components

## Context

> Read `.project/redesign-context.md` for full design direction and reference images.

## Description

Redesign all goal-related pages (list, create, detail, edit) for a consistent Wise-inspired look.

## Pages Covered

1. **Goals List** (`src/frontend/features/admin/goals-list/goals-list-view.tsx`)
2. **Goal Create** (`src/frontend/features/admin/goals-create/goal-create-view.tsx`)
3. **Goal Detail** (`src/frontend/features/admin/goals-detail/goal-detail-view.tsx`)
4. **Goal Edit** (`src/frontend/features/admin/goals-edit/goal-edit-view.tsx`)

## Target Design

### Goals List

1. **Page Header**: `StandardPageLayout` + "Create Goal" button (gold)
2. **Filter Chips**: Status filter as inline pill chips (All / In Progress / Achieved / Completed)
3. **Goal Cards**: 2-column grid on mobile, list on desktop
   - Each card: goal name (bold), progress bar (gold fill), current/target amounts, target date, status badge
   - Click navigates to goal detail
4. **Empty State**: Centered, "No goals yet", gold CTA to create

### Goal Create

- Clean form page matching the holdings create form style
- Fields: name, description, target amount, target date
- Gold "Create" button via `detail-actions`

### Goal Detail

1. **Hero**: Goal name (large), status badge, target date
2. **Progress Section**: Large progress bar (gold), current value / target amount
3. **Metrics Cards**: Invested amount, PnL, remaining, time remaining
4. **Linked Holdings**: `ListRow` components showing associated holdings
5. **Actions**: Complete/Reopen button, Edit link, Delete (with confirmation)

### Goal Edit

- Same form pattern as Goal Create, pre-populated with existing data
- Only changed fields sent to API

## Scope

- [ ] Redesign goals list page
- [ ] Redesign goal create page
- [ ] Redesign goal detail page
- [ ] Redesign goal edit page
- [ ] Update skeletons to match new layouts
- [ ] Maintain all existing data fetching, mutations, and validation

## Acceptance Criteria

- All 4 goal pages render with consistent Wise-inspired design
- CRUD operations work correctly (create, read, update, delete)
- Goal completion/reopening works
- Linked holdings display correctly on detail page
- Filter works on list page
- `npm run build` passes

## Files Modified

- `src/frontend/features/admin/goals-list/goals-list-view.tsx` + components
- `src/frontend/features/admin/goals-create/goal-create-view.tsx` + components
- `src/frontend/features/admin/goals-detail/goal-detail-view.tsx` + components
- `src/frontend/features/admin/goals-edit/goal-edit-view.tsx`
