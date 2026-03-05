# [0142][redesign][holdings-create] Holdings Create Wizard Redesign

**Severity**: Medium
**Category**: Frontend / Redesign
**Estimated Effort**: Medium
**Depends On**: `[0135]` tokens, `[0136]` components, `[0138]` shared fragments

## Context

> Read `.project/redesign-context.md` for full design direction and reference images.
>
> **Primary reference**: `Wise Web 44.png` (multi-step send flow with linear progress bar)

## Description

Redesign the 4-step add holding wizard for a cleaner, more guided experience matching Wise's multi-step flow pattern.

## Current State

**View file**: `src/frontend/features/admin/holdings-create/add-holding-view.tsx`
**Sub-components**: 5 files in `./components/`

4-step wizard: Brand selection → Weight selection → Purchase details → Review. Uses `StepHeader` and `WizardFooter`.

## Target Design

1. **Step Progress Bar**
   - Linear progress indicator at the top (like Wise: Amount → You → Recipient → Review → Pay)
   - Step labels visible on desktop, dots-only on mobile
   - Current step: gold accent, completed: checkmark, upcoming: muted

2. **Step 1: Brand Selection**
   - 2-column card grid for brands (brand logo/icon + name)
   - Selected state: gold border + subtle gold background
   - Custom brand: input field that appears when "Other" is selected

3. **Step 2: Weight Selection**
   - Clean denomination chips/cards in a grid
   - Each chip shows weight + current price
   - Selected state: gold border

4. **Step 3: Purchase Details**
   - Clean form fields with labels above
   - Price input with currency prefix
   - Date picker
   - Notes textarea
   - Goal selector dropdown

5. **Step 4: Review**
   - Summary card with all entered details
   - Clean key-value rows
   - Gold "Submit" button

## Scope

- [ ] Update `add-holding-view.tsx` with new step progress UI
- [ ] Update each step component for cleaner styling
- [ ] Update `step-header.tsx` and `wizard-footer.tsx` (covered in `[0138]`)
- [ ] Maintain all form logic and validation

## Acceptance Criteria

- Wizard flows smoothly through all 4 steps
- Step progress indicator is clear and accurate
- Form validation works correctly
- Submission creates holding and redirects
- `npm run build` passes

## Files Modified

- `src/frontend/features/admin/holdings-create/add-holding-view.tsx`
- `src/frontend/features/admin/holdings-create/components/*.tsx`
