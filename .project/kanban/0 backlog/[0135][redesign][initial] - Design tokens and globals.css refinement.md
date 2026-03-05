# [0135][redesign][initial] Design Tokens & globals.css Refinement

**Severity**: High
**Category**: Frontend / Design System
**Estimated Effort**: Small
**Depends On**: None (first task)
**Blocks**: All other `[redesign]` tasks

## Context

> Read `.project/redesign-context.md` for full design direction and reference images.

The admin UI is being redesigned to follow a **Wise.com-inspired clean financial aesthetic**: light-first, generous whitespace, bold hero numbers, and subtle cards. This task updates the design token foundation.

## Description

Refine the CSS custom properties in `src/app/globals.css` and `@theme inline` block to ensure the light-mode palette matches the Wise-inspired design direction. Dark mode tokens should remain functional but light mode is the design benchmark.

## Scope

### Light Mode `:root` Adjustments

- [ ] Verify `--background` is pure white (`#FFFFFF` / `oklch(1 0 0)`) — already correct
- [ ] Verify `--surface` is a very subtle warm gray for cards (current `#F9FAFB` is good, consider `#F5F5F5` for slightly more contrast)
- [ ] Ensure `--text-secondary` provides enough contrast for supporting text but stays clearly muted
- [ ] Review card shadow tokens — Wise uses almost no shadows. Ensure `--shadow-sm` is very subtle (current value is fine)
- [ ] Add `--surface-hover` token for card hover states (e.g., `#F0F0F0`)

### Typography Scale Review

- [ ] Review `Typography` component variants — ensure the scale covers:
  - Hero number size (for portfolio total) — may need a `hero` or `display` variant (`text-4xl font-bold`)
  - Value size (for individual holdings) — `text-xl font-semibold`
  - Current variants (h1-h4, body, body-sm, caption, detail) should remain unchanged

### Card Component Audit

- [ ] Ensure the existing `Card` component (from shadcn/ui) uses `bg-surface` + `rounded-xl` + `border border-border` as defaults
- [ ] If no Card component exists, note that one should be created in the `[component]` task
- [ ] Verify cards look clean on pure white backgrounds (subtle border, no heavy shadow)

### No Breaking Changes

- [ ] All existing components must continue to render correctly after token changes
- [ ] Dark mode tokens are NOT the focus but must not break

## Acceptance Criteria

- `globals.css` updated with any refined tokens
- `npm run build` passes without errors
- Visual spot-check: dashboard page renders with clean light-mode appearance
- No dark-mode regressions (basic visual check)

## Files Likely Modified

- `src/app/globals.css`
- Possibly `src/frontend/components/ui/typography.tsx` (if adding `hero`/`display` variant)
