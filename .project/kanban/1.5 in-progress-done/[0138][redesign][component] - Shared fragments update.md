# [0138][redesign][component] Shared Fragments Update

**Severity**: Medium
**Category**: Frontend / Design System
**Estimated Effort**: Small
**Depends On**: `[0135]` Design tokens, `[0136]` Core UI primitives

## Context

> Read `.project/redesign-context.md` for full design direction and reference images.

## Description

Update shared admin fragments to align with the Wise-inspired design. These fragments are reused across multiple pages, so updating them cascades the new look everywhere.

## Scope

### detail-actions.tsx

- [ ] Simplify the footer: clean white background, subtle top border, comfortable padding
- [ ] Buttons use the updated Button component props — no manual Tailwind overrides
- [ ] On desktop (`md:`): render inline (not fixed), right-aligned

### detail-header.tsx

- [ ] Use `Typography display` variant for hero values
- [ ] Badge should use rounded-full pill style with semantic colors
- [ ] Clean spacing between title, subtitle, and value

### empty-state.tsx

- [ ] Center-aligned layout with generous vertical padding
- [ ] Muted icon (gray, not colored), clean title + description
- [ ] Primary CTA as a gold `ActionChip` or `Button color="primary"`
- [ ] Match Wise's minimal empty state feel

### step-header.tsx

- [ ] Clean sticky header with back arrow, step title, and "Step X of Y" counter
- [ ] White background, subtle bottom border
- [ ] Match Wise Web's step progress bar (Amount → You → Recipient → Review)
- [ ] Consider adding a linear progress indicator below the header

### wizard-footer.tsx

- [ ] Gold primary button, comfortable padding, clean white background
- [ ] Match the `detail-actions` pattern for consistency

## Acceptance Criteria

- All fragments use design tokens — no arbitrary Tailwind values
- All text uses `Typography` component
- Visual consistency across all pages that use these fragments
- `npm run build` passes
- `npm run lint` passes

## Files Modified

- `src/frontend/components/fragments/admin/detail-actions.tsx`
- `src/frontend/components/fragments/admin/detail-header.tsx`
- `src/frontend/components/fragments/admin/empty-state.tsx`
- `src/frontend/components/fragments/admin/step-header.tsx`
- `src/frontend/components/fragments/admin/wizard-footer.tsx`
