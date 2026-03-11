# [0146][redesign][holdings-edit] Holdings Edit Page Redesign

**Severity**: Low
**Category**: Frontend / Redesign
**Estimated Effort**: Small
**Depends On**: `[0135]` tokens, `[0136]` components, `[0138]` fragments

## Context

> Read `.project/redesign-context.md` for full design direction and reference images.

## Description

Redesign the holdings edit form to match the clean form patterns established in the holdings create wizard.

## Current State

**View file**: `src/frontend/features/admin/holdings-edit/edit-holding-view.tsx`
No dedicated sub-components — reuses `WeightSelector` and `GoalSelector` from `holdings-create/components/`.

## Target Design

- Clean form page with `StandardPageLayout` + breadcrumbs
- Brand name displayed as a read-only locked field (subtle gray card)
- Editable fields: weight (reuses `WeightSelector`), buy price, purchase date, notes, goal selector
- Clean form labels above inputs
- `DetailActions` footer: Cancel + Save (gold)

## Scope

- [ ] Update `edit-holding-view.tsx` styling to match new design
- [ ] Reuse updated components from `[0142]` (WeightSelector, GoalSelector)
- [ ] Maintain all edit logic (PATCH mutation, changed fields detection)

## Acceptance Criteria

- Edit form renders cleanly with consistent styling
- Only changed fields are sent to API
- Validation works correctly
- `npm run build` passes

## Files Modified

- `src/frontend/features/admin/holdings-edit/edit-holding-view.tsx`
