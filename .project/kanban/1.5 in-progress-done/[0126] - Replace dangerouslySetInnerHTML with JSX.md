# [0006] Replace dangerouslySetInnerHTML with JSX

**Priority:** Low
**Effort:** Tiny (2 files, 3 occurrences)
**Category:** Security / Code Quality

---

## Problem

3 usages of `dangerouslySetInnerHTML` for static i18n strings with `<strong>` bolding. Low XSS risk but unnecessary — can be replaced with JSX.

## Files

- `src/frontend/features/public/privacy/privacy-view.tsx` (lines 142, 152)
- `src/frontend/features/admin/holdings-create/components/brand-selector.tsx` (line 60)

## Action

Replace `dangerouslySetInnerHTML` with JSX using `<Typography>` and inline `<strong>` or `fontWeight` styling.

## Acceptance Criteria

- [ ] Zero `dangerouslySetInnerHTML` in feature files
- [ ] Visual output unchanged
- [ ] `npm run build` passes
