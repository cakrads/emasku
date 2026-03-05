# [0134] Accessibility Audit and Fixes

**Severity**: Low
**Category**: Accessibility / Quality
**Estimated Effort**: Medium

## Description

The frontend has been cleaned up structurally, but accessibility (a11y) has not been audited. This task identifies and fixes the most impactful WCAG 2.1 AA violations.

## Scope

### Automated Scan
- [ ] Install and run `axe-core` or `eslint-plugin-jsx-a11y` across the codebase
- [ ] Fix all `critical` and `serious` violations reported

### Manual Checks (Key Pages)

**Login page (`/login`)**
- [ ] Checkbox + Label association is correct (`htmlFor` matches `id`)
- [ ] Error messages are announced via `role="alert"` or `aria-live`
- [ ] Google login button has accessible label

**Dashboard & Holdings**
- [ ] Tables have `<caption>` or `aria-label`
- [ ] Interactive cards/rows have `role="button"` and keyboard `onKeyDown` handlers
- [ ] Charts/graphs have text alternatives (`aria-label` or visually hidden description)

**Forms (add/edit holding, goals)**
- [ ] All inputs have visible labels (not just placeholder)
- [ ] Required fields marked with `aria-required="true"` in addition to visual `*`
- [ ] Validation errors linked to inputs via `aria-describedby`

**Navigation**
- [ ] Skip-to-content link at top of page
- [ ] Keyboard focus order is logical (no focus traps outside modals)
- [ ] All modals trap focus correctly and restore on close

### Color Contrast
- [ ] `accent-gold` text on white background meets 4.5:1 ratio
- [ ] Muted text (`text-muted-foreground`) meets 3:1 for large text

## Acceptance Criteria

- Zero `critical` axe violations on login, dashboard, and holdings pages
- All form inputs have associated labels
- Full keyboard navigation works on all pages without a mouse
