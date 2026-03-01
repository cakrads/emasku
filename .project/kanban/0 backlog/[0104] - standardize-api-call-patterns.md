# PRD: Standardize API Call Patterns Through Service Layer

## Category: Code Quality
## Severity: Minor
## Target Files:
- `src/frontend/features/admin/profile/profile-view.tsx`
- `src/frontend/services/user/user.api.ts` (new)

## Problem
Most components use the service layer for API calls, but some components call `fetch` directly, bypassing centralized error handling, auth headers, and response parsing.

## Evidence
```tsx
// ✅ Consistent – uses service layer
import { fetchPortfolioHoldings } from '@/frontend/services/portfolio/portfolio.api'
const { data } = useQuery({ queryFn: fetchPortfolioHoldings })

// ❌ Inconsistent – direct fetch in profile-view.tsx
const response = await fetch('/api/v1/user/export')
const response = await fetch('/api/v1/user/delete', { method: 'DELETE' })
```

## Solution
1. Create `src/frontend/services/user/user.api.ts` with `exportUserData()` and `deleteUser()`.
2. Migrate `profile-view.tsx` to use the new service functions.
3. Audit for any other direct `fetch` calls outside the service layer.

### Example
```tsx
// services/user/user.api.ts
export async function exportUserData(): Promise<Blob> {
  const response = await fetch('/api/v1/user/export')
  if (!response.ok) throw new Error('Export failed')
  return response.blob()
}

export async function deleteUser(): Promise<void> {
  const response = await fetch('/api/v1/user/delete', { method: 'DELETE' })
  if (!response.ok) throw new Error('Delete failed')
}
```

## Verification
- `grep -r "await fetch(" src/frontend/features/` returns zero results outside service files.
- Export and delete functionality still works end-to-end.
- Error states are handled consistently via the service layer.
