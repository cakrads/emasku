# [0115] Lazy Load Modal Components

## Category
Performance — Bundle Size

## Severity
Minor

## Problem

Modal components are imported statically and bundled upfront even though they render closed on mount. Each modal adds ~10-15KB to the initial bundle that isn't needed until the user explicitly opens it.

## Target Files

| File | Modals to Lazy Load |
|------|-------------------|
| `src/frontend/features/admin/holdings-list/holdings-list-view.tsx` | `FilterModal`, `BrandSummaryModal`, `ToolsModal` |
| `src/frontend/features/admin/goals/goals-list/goals-list-view.tsx` | `GoalFilterModal` |
| `src/frontend/features/admin/profile/profile-view.tsx` | `LogoutDialog`, `AlertDialog` |

## Solution

Replace static imports with `next/dynamic`:

```tsx
import dynamic from 'next/dynamic'

const FilterModal = dynamic(() => import('./components/filter-modal'), { ssr: false })
const BrandSummaryModal = dynamic(() => import('./components/brand-summary-modal'), { ssr: false })
```

Apply this pattern to all modals listed above. No loading skeleton needed since modals are triggered by user action.

## Verification

- [ ] `npm run build` — compare bundle sizes before/after (~30-45KB deferred)
- [ ] All modals still open and close properly
- [ ] Modal content renders correctly after lazy load
- [ ] No hydration errors in browser console
