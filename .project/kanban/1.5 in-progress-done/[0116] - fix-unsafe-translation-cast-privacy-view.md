# Fix Unsafe Translation Array Cast in Privacy View

**Source:** CodeRabbit FE Review #3 — Issue #2
**Severity:** HIGH
**Type:** Bug Fix (runtime crash prevention)

## Problem

`src/frontend/features/public/privacy/privacy-view.tsx` (lines 73, 84, 95, 111) uses:
```tsx
(t('privacy.sections.collectedData.identity.items') as unknown as string[]).map((item, i) => ...)
```

Force-casting via `as unknown as string[]` bypasses TypeScript safety. If the translation key is missing, misspelled, or returns a fallback string instead of an array, `.map()` throws a runtime TypeError crashing the entire Privacy page.

## Fix

```tsx
const items = t('privacy.sections.collectedData.identity.items', { returnObjects: true })
const safeItems = Array.isArray(items) ? items : []
safeItems.map((item, i) => ...)
```

Apply to all 4 instances in the file.

## Files

- `src/frontend/features/public/privacy/privacy-view.tsx`
