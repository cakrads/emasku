# Fix Unguarded Array Index Access on Provider

**Source:** CodeRabbit FE Review #3 — Issue #4
**Severity:** MEDIUM
**Type:** Bug Fix (runtime crash prevention)

## Problem

`src/frontend/features/public/landing/components/price-section.tsx`:
```tsx
<span className="font-bold text-accent-gold text-lg">{item.provider[0]}</span>
```

If `item.provider` is `null` or `undefined` from the API response, accessing `[0]` throws a TypeError.

## Fix

```tsx
<span className="font-bold text-accent-gold text-lg">
  {item.provider?.charAt(0) ?? '?'}
</span>
```

## Files

- `src/frontend/features/public/landing/components/price-section.tsx`
