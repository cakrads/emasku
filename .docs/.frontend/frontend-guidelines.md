# Frontend Development Guidelines (Emasku)

This document outlines the strict conventions for contributing to the Emasku frontend. Following these rules ensures consistency, maintainability, and compatibility with our design system.

---

## 📁 Feature Folder Structure

 We use a **Grouped Feature Structure** inside `src/frontend/features/`.

### 1. Top-Level Grouping

 Features are divided into two primary domains:

- `src/frontend/features/admin/`: For authenticated, user-private features.
- `src/frontend/features/public/`: For public-facing, unauthenticated features.

### 2. Feature Naming

 Inside these groups, we use descriptive, hyphenated names:

- **Convention**: `[group]/[entity]-[action]`
- **Admin Examples**:
  - `admin/dashboard`
  - `admin/holdings-list`
  - `admin/profile`
- **Public Examples**:
  - `public/login`
  - `public/prices-list`
  - `public/prices-history`

 **Rule**: One folder = One page/feature. Do not nest deeper than the feature level.

---

## 🔘 Button Component & Design System

The `Button` component (`src/frontend/components/ui/button.tsx`) has been enhanced to reduce reliance on custom Tailwind classes.

### 1. Semantic Colors

Use the `color` prop instead of manually setting background colors.

- `color="primary"`: Main action Gold (`--accent-gold`). Used for "Add", "Save", "Submit".
- `color="warning"`: Orange/Amber. Used for "Mark as Sold", "Withdraw", or secondary alerts.
- `color="error"`: Red. Used for "Delete", "Remove", or critical destructive actions.

### 2. Layout & Shape Props

- `fullWidth`: Boolean prop to set `width: 100%`. (Use instead of `className="w-full"`)
- `size="xl"`: Large action size (h-14). Recommended for primary mobile actions.
- `rounded="xl"`: Standard rounding for feature action buttons.
- `rounded="full"`: For circular buttons or FABs.

### 3. Preferred Pattern

```tsx
// DO:
<Button 
  variant="outline" 
  color="warning" 
  size="xl" 
  rounded="xl" 
  fullWidth
>
  Mark as Sold
</Button>

// DON'T:
<Button className="w-full h-14 bg-orange-500 rounded-xl text-white ...">
  Mark as Sold
</Button>
```

---

## 🧩 Inter-Feature Dependencies

- **Imports**: Favor absolute aliases (e.g., `@/frontend/features/admin/holdings-list/components/...`).
- **Standard Layout**: Every feature view should wrap its content in `<StandardPageLayout />` from `@/frontend/components/layout/standard-page-layout`.
- **Typography**: Never use raw `h1-h6` or `p`. Use `<Typography variant="..." />`.
- **Layout Primitives**: Use `<Stack />`, `<Section />`, and `<Container />` for all spacing.
- **Interactivity**: Labels and Checkboxes must have `cursor-pointer`.

---

## 📂 Supporting Directories

### `utils/`

Frontend utilities: `api-client.ts` (HTTP wrapper), `format.ts` (display formatting), `cn.ts` (class merging), `aggregations.ts` (data aggregation helpers), `get-base-url.ts`, `get-query-client.ts`.

### `context/`

React contexts for cross-cutting concerns. Currently: `language-context.tsx` for i18n.

### `providers/`

App-wide providers wrapping the root layout:
- `auth-provider.tsx` + `auth.store.ts` (Zustand for auth state)
- `react-query-provider.tsx` (TanStack Query)
- `theme-provider.tsx` (Dark/light theme)

### `config/`

Frontend configuration constants. Currently: `routes.ts` for route path definitions.

### `data/`

Static/reference data used by the frontend (e.g., brand options, denomination lists).

---

## 🎨 Styling Rules

### Color Tokens

All colors must use CSS variable tokens defined in `src/app/globals.css`. Never use raw Tailwind color classes.

| Token | Use |
|---|---|
| `text-foreground` | Primary text |
| `text-text-secondary` | Muted/supporting text |
| `text-muted-foreground` | Faded UI text |
| `bg-background` | Page background |
| `bg-card` | Card/panel background |
| `bg-surface` | Section background |
| `bg-surface-elevated` | Elevated surface (dropdown, tooltip) |
| `bg-muted` | Muted background |
| `bg-accent-gold` | Gold accent (primary actions) |
| `border-border` | Default borders |
| `text-positive` / `bg-positive-bg` | Profit / success state |
| `text-negative` / `bg-negative-bg` | Loss / error state |
| `text-destructive` | Destructive action text |

### Spacing Scale

Only use Tailwind's default spacing scale: `0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96`. The `Stack` component provides named gaps: `xs` (gap-1), `sm` (gap-2), `md` (gap-4), `lg` (gap-6), `xl` (gap-8).

### cva Pattern (correct vs incorrect)

```tsx
// ✅ CORRECT — use cva with design tokens
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/frontend/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        success: "bg-positive-bg text-positive",
        danger: "bg-negative-bg text-negative",
        info: "bg-accent-gold/10 text-accent-gold",
        neutral: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
)

// ❌ WRONG — raw Tailwind colors, conditional className strings
const classes = `badge ${variant === 'success' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`
```

---

## 🧩 Component Patterns

### Simple Component (forwardRef + cn + rest props)

```tsx
import * as React from "react"
import { cn } from "@/frontend/utils/cn"

interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
}

const InfoCard = React.forwardRef<HTMLDivElement, InfoCardProps>(
  ({ title, className, children, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border border-border bg-card p-4", className)} {...props}>
      <Typography variant="h3">{title}</Typography>
      <Stack gap="sm">{children}</Stack>
    </div>
  )
)
InfoCard.displayName = "InfoCard"
export { InfoCard }
```

### Variant Component (cva + VariantProps)

Use `cva` when the component has 2+ visual axes. See `src/frontend/components/ui/button.tsx` for the canonical example with `compoundVariants`.

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/frontend/utils/cn"

const statusVariants = cva("rounded-full px-3 py-1 text-xs font-medium", {
  variants: {
    status: {
      active: "bg-positive-bg text-positive",
      sold: "bg-muted text-muted-foreground",
      pending: "bg-accent-gold/10 text-accent-gold",
    },
  },
  defaultVariants: { status: "active" },
})

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof statusVariants> {}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  return <span className={cn(statusVariants({ status }), className)} {...props} />
}
```

### Manual Variant Pattern (object map + cn)

For simple cases with a single variant axis, use a plain object map (like `Typography` does):

```tsx
const variants = {
  h1: "text-2xl font-bold text-foreground",
  h2: "text-xl font-semibold text-foreground",
  body: "text-base text-foreground",
  caption: "text-xs text-text-secondary",
}

export function Typography({ variant = "body", className, ...props }: TypographyProps) {
  return <span className={cn(variants[variant], className)} {...props} />
}
```

---

## 📄 Feature Page Template

### File Structure

```
src/frontend/features/[group]/[entity]-[action]/
├── [entity]-[action]-view.tsx          ← Exported View component
└── components/
    ├── [entity]-[action]-skeleton.tsx   ← Loading skeleton
    └── [sub-component].tsx             ← Page-specific components
```

### View File Pattern

Every feature view uses a two-component split: an outer wrapper for layout and an inner component for data/UI.

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { fetchItems } from '@/frontend/services/items/items.api'
import { transformItems } from '@/frontend/view-model/items.vm'
import { ItemsListSkeleton } from './components/items-list-skeleton'

// Inner component — data fetching + UI composition
function ItemsListContent() {
  const { data, isLoading } = useQuery({
    queryKey: ['items', 'list'],
    queryFn: () => fetchItems(),
  })

  const viewModel = data ? transformItems(data) : null

  if (isLoading) return <ItemsListSkeleton />
  if (!viewModel) return null

  return (
    <Stack gap="lg">
      <Typography variant="body-sm">
        {viewModel.totalCount} items found
      </Typography>
      {/* ... render content ... */}
    </Stack>
  )
}

// Outer component — layout wrapper
export default function ItemsListView() {
  return (
    <StandardPageLayout
      title="Items"
      breadcrumbs={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Items' },
      ]}
    >
      <ErrorBoundary>
        <ItemsListContent />
      </ErrorBoundary>
    </StandardPageLayout>
  )
}
```

**Key rules:**
- `'use client'` directive at the top
- `StandardPageLayout` provides `Container`, `PageHeader` (breadcrumbs + title + optional action slot)
- For dashboard-style pages without breadcrumbs, use `PageWrapper` + `Container` directly
- All sub-components go in `./components/` — never define inline components in the view file
- Loading states use dedicated skeleton components, not inline spinners

---

## 🔄 View-Model Pattern

View-models transform raw API contract data into UI-friendly shapes. They live in `src/frontend/view-model/<entity>.vm.ts`.

**Rules:**
- Only format/reshape — never perform business logic or financial math
- Export a `*VM` interface and a `transform*` function
- Keep formatting helpers private (not exported)
- Accept the shared contract type as input

```tsx
// src/frontend/view-model/holdings.vm.ts

import { HoldingDetail } from '@/shared/contracts/portfolio.contract'

// Private helpers — not exported
function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

function getPnLColor(value: number): string {
  if (value > 0) return 'text-positive'
  if (value < 0) return 'text-negative'
  return 'text-muted-foreground'
}

// Exported VM interface
export interface HoldingDetailVM {
  id: string
  brandName: string
  weightDisplay: string
  currentValueDisplay: string
  pnlDisplay: string
  pnlColor: string
  purchaseDateDisplay: string
}

// Exported transform function
export function transformHoldingDetail(api: HoldingDetail): HoldingDetailVM {
  return {
    id: api.id,
    brandName: api.brandName,
    weightDisplay: `${api.weightGram}g`,
    currentValueDisplay: formatIDR(api.currentValue),
    pnlDisplay: formatIDR(api.pnl),
    pnlColor: getPnLColor(api.pnl),
    purchaseDateDisplay: new Date(api.purchaseDate).toLocaleDateString('id-ID'),
  }
}
```

---

## 🔌 React Query Pattern

### Query Key Convention

```tsx
// Pattern: [entity, action, ...filters, ...pagination]
queryKey: ['portfolio', 'summary']
queryKey: ['holdings', 'list', { brand, status, page, limit }]
queryKey: ['prices', 'history', { brandCode, period }]
```

### Service File Pattern

Services live in `src/frontend/services/<domain>/<domain>.api.ts`. They use `fetchJson` + Zod schema validation.

```tsx
// src/frontend/services/items/items.api.ts

import { fetchJson } from '@/frontend/utils/api-client'
import { getBaseUrl } from '@/frontend/utils/get-base-url'
import {
  type ItemsListResponse,
  ItemsListResponseSchema,
  type CreateItemRequest,
  type CreateItemResponse,
  CreateItemResponseSchema,
} from '@/shared/contracts/items.contract'

// GET — accepts optional RequestInit for SSR pass-through
export async function fetchItems(init?: RequestInit): Promise<ItemsListResponse> {
  const data = await fetchJson<unknown>(`${getBaseUrl()}/api/v1/items`, init)
  return ItemsListResponseSchema.parse(data)
}

// POST — explicit method, Content-Type, JSON body
export async function createItem(request: CreateItemRequest): Promise<CreateItemResponse> {
  const data = await fetchJson<unknown>(`${getBaseUrl()}/api/v1/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  return CreateItemResponseSchema.parse(data)
}
```

### Mutation Pattern (with toast + invalidation)

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createItem } from '@/frontend/services/items/items.api'

function useCreateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      toast.success('Item created')
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
    onError: () => {
      toast.error('Failed to create item')
    },
  })
}
```

---

## ✅ Pre-Generation Checklist

Before finishing any component or page generation, verify:

- [ ] No arbitrary Tailwind values (`text-[15px]`, `bg-[#fff]`, `mt-[22px]`)
- [ ] No raw Tailwind color classes (`gray-500`, `blue-200`, `green-100`) — use design tokens
- [ ] No inline styles (`style={{ ... }}`)
- [ ] No inline components — all extracted to proper files in `./components/`
- [ ] TypeScript — no untyped `any` without explicit justification
- [ ] All text uses `<Typography variant="..." />`
- [ ] All layout uses `Stack` / `Section` / `Container` — no raw `div` / `p` / `h1-h6`
- [ ] All className composition uses `cn()` from `@/frontend/utils/cn`
- [ ] All imports use `@/` alias — no relative `../../` across pillars
- [ ] Button uses semantic props (`color`, `fullWidth`, `size`, `rounded`) — no manual Tailwind overrides
