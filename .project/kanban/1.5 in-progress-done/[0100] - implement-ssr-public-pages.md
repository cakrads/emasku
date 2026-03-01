# PRD: Migrate Public Price Pages to SSR + React Query Hydration Pattern

## Category: Architecture
## Severity: Critical
## Target Files:
- `src/app/prices/page.tsx`
- `src/frontend/features/public/prices-list/prices-list-view.tsx`
- `fetchTodayPrices` implementation
- React Query provider setup (if hydration boundary not yet implemented)

## 1. Objective
Refactor public price pages from client-only data fetching to:
- Server-Side Rendering (SSR or ISR) as primary data source
- React Query as client-side cache + revalidation layer

This must eliminate client-side first-load fetching while preserving React Query functionality for subsequent updates.

## 2. Current Problem
Public price pages currently:
- Use `'use client'`
- Fetch via `useQuery`
- Show loading spinner on every navigation
- Provide empty HTML to crawlers (bad SEO)
- Trigger API request on every client mount
- Do not leverage Next.js server caching or ISR

Example:
```tsx
'use client'

const { data, isLoading } = useQuery({
  queryKey: ['prices', 'today'],
  queryFn: fetchTodayPrices,
})
```
This results in:
- Double rendering
- Poor TTFB
- Wasted network requests
- No HTML content in initial response

## 3. Target Architecture
**Principle**:
For public, non-user-specific data:
- Fetch on server
- Cache at server level using ISR
- Hydrate React Query with server data
- Prevent immediate refetch
- Allow refetch when stale or parameters change

## 4. Required Implementation

### 4.1 Server Component Page
Convert `src/app/prices/page.tsx` into a Server Component.
Requirements:
- Remove `'use client'`
- Fetch data using `await fetchTodayPrices()`
- Use `export const revalidate = <seconds>` (ISR)
- Pass data as prop OR use React Query dehydrate pattern

Example:
```tsx
// src/app/prices/page.tsx
import PricesListView from '@/frontend/features/public/prices-list/prices-list-view'
import { fetchTodayPrices } from '@/lib/api'

export const revalidate = 60 // 60 seconds ISR

export default async function PricesPage() {
  const prices = await fetchTodayPrices()
  return <PricesListView initialData={prices} />
}
```

### 4.2 Client Component Hydration
`prices-list-view.tsx` remains a Client Component.
Requirements:
- Accept `initialData` prop
- Use React Query
- Set proper `staleTime`
- Must NOT immediately refetch on mount

Example:
```tsx
'use client'

import { useQuery } from '@tanstack/react-query'

export default function PricesListView({ initialData }) {
  const { data } = useQuery({
    queryKey: ['prices', 'today'],
    queryFn: fetchTodayPrices,
    initialData,
    staleTime: 60_000, // Must match or align with ISR duration
  })

  return (...)
}
```

## 5. Alternative (Preferred for Scalability)
If multiple queries exist on the page, implement proper hydration boundary:

**Server**
- Create QueryClient
- Prefetch query
- Dehydrate
- Wrap in `<HydrationBoundary>`

**Client**
- Use normal `useQuery`
- No `initialData`
- Set `staleTime`

This pattern is required if more than one query exists on the page.

## 6. Strict Rules
The agent MUST ensure:
- **Strict Layer Separation**: Frontend code MUST NOT import from the `application` folder (e.g., UseCases, Repositories). The frontend must only communicate with the backend via HTTP calls. Server-side data fetching must use absolute URLs.
- No `'use client'` in `page.tsx`
- No client-only first fetch
- No loading spinner on first render
- No double API request on initial load
- `staleTime` is defined
- `revalidate` is defined
- `fetchTodayPrices` does NOT use `cache: 'no-store'` unless required
- Public pages must not depend on browser-only APIs

## 7. Caching Strategy Alignment
The following must be aligned:
| Layer | Configuration |
| --- | --- |
| Next.js ISR | `revalidate = 60` |
| React Query | `staleTime: 60_000` |

Mismatch is not allowed.

## 8. Verification Checklist
After implementation:

**Server Rendering**
- View page source
- Price data must exist in HTML
- No empty shell

**Network Tab**
- On first load:
  - Only one API call (server-side)
  - No immediate client duplicate call
- On navigation within staleTime:
  - No refetch
- After staleTime:
  - Refetch occurs

**UX**
- No loading spinner on initial page load
- Page content visible immediately

**SEO**
- Lighthouse SEO score improves
- Crawlers can read price data

## 9. Non-Goals
- Do not remove React Query
- Do not convert entire feature to pure server rendering
- Do not add client-side polling
- Do not add unnecessary global state

## 10. Expected Outcome
After migration:
- Faster TTFB
- Better SEO
- Reduced API calls
- Cleaner separation of server vs client responsibility
- Scalable pattern for other public pages

## 11. Architectural Principle Going Forward
All public, cacheable, non-user-specific pages must follow:
- Server-first rendering
- Client for interactivity only

Client-only fetching for public SEO pages is not acceptable moving forward.
