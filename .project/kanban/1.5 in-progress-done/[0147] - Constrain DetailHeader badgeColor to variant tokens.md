# [0147] Constrain DetailHeader badgeColor to Variant Tokens

**Severity**: Low
**Category**: Design System / Code Quality

## Description

`DetailHeader` currently accepts `badgeColor?: string`, allowing callers to pass arbitrary Tailwind class strings. This bypasses design-token constraints (violates the "no raw Tailwind color classes" rule).

## Scope

- Change `badgeColor?: string` to `badgeVariant?: "neutral" | "success" | "warning" | "danger"` in `detail-header.tsx`
- Add a `BADGE_VARIANT_CLASSES` lookup map inside the component to resolve each variant to a predefined set of tokenized class strings
- Update the `<span>` in `DetailHeader` to use the lookup map instead of directly spreading `badgeColor`
- Update all callers to pass the new variant value (currently no callers — verify at time of implementation)

## Acceptance Criteria

- `badgeColor` prop removed; `badgeVariant` union prop replaces it
- All badge colors resolve through the class map (no raw color strings at call sites)
- No arbitrary Tailwind values used in the class map
