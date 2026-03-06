# [0136][redesign][component] Core UI Primitives Update

**Severity**: High
**Category**: Frontend / Design System
**Estimated Effort**: Medium
**Depends On**: `[0135]` Design tokens
**Blocks**: All page-level `[redesign]` tasks

## Context

> Read `.project/redesign-context.md` for full design direction and reference images.

After tokens are updated, the shared UI primitives need to align with the Wise-inspired design: clean cards, appropriate spacing, and a hero-number capable typography system.

## Description

Update or create core UI components so every page-level redesign can compose from the same consistent building blocks.

## Scope

### Typography Enhancement

- [ ] Add a `display` variant to `Typography` component: `text-4xl font-bold tracking-tight text-foreground` — used for portfolio total value (hero numbers)
- [ ] Add a `value` variant: `text-xl font-semibold text-foreground` — used for individual card values
- [ ] Existing variants remain unchanged

### Card Component

- [ ] Create or update a `Card` primitive in `src/frontend/components/ui/card.tsx`:
  - Base: `bg-card rounded-xl border border-border p-4`
  - Variants via `cva`: `default` (as above), `surface` (`bg-surface`), `interactive` (adds hover state)
  - Expose `CardHeader`, `CardContent` sub-components for consistent internal structure
  - If shadcn Card already exists, extend it — do NOT replace
- [ ] Card must look clean on both white and dark backgrounds

### Action Chip Component

- [ ] Create `ActionChip` component in `src/frontend/components/ui/action-chip.tsx`
  - Pill-shaped button for quick actions (like Wise's "Send", "Add money", "Request" chips)
  - Props: `icon` (optional React node), `label` (string), `onClick`, `variant` (`primary` = gold fill, `outline` = border only)
  - Size: compact (`h-9 px-4 rounded-full text-sm`)
  - Used on: dashboard quick actions, holdings list toolbar

### Stat Card Component

- [ ] Create `StatCard` in `src/frontend/components/fragments/admin/stat-card.tsx`
  - A compact card showing a single metric: label (caption) + value (large bold) + optional trend indicator
  - Used for: portfolio summary bar (total weight, buy value, current value, PnL)
  - Composition: `Card` + `Typography`

### List Row Component

- [ ] Create `ListRow` in `src/frontend/components/ui/list-row.tsx`
  - A standardized list item: leading slot (icon/avatar) + title + subtitle stacked + trailing slot (value + sub-value)
  - Divider between rows (via `Divider` from layout.tsx)
  - Used for: holdings preview, transaction lists, goal lists
  - Props: `leading`, `title`, `subtitle`, `trailing`, `trailingSubtitle`, `onClick`

### Section Header Component

- [ ] Create `SectionHeader` in `src/frontend/components/ui/section-header.tsx`
  - Left: bold section title (Typography h3)
  - Right: optional text link ("See all" / "Filter") with `onClick` or `href`
  - Used pervasively across dashboard and list pages

## Acceptance Criteria

- All new components follow cva or variant-map patterns
- All use `cn()` for className composition
- No raw HTML tags — built on existing primitives
- Storybook not required, but each component should be visually testable in isolation
- `npm run build` passes
- `npm run lint` passes

## Files Created/Modified

- `src/frontend/components/ui/typography.tsx` (modify — add variants)
- `src/frontend/components/ui/card.tsx` (create or modify)
- `src/frontend/components/ui/action-chip.tsx` (create)
- `src/frontend/components/ui/list-row.tsx` (create)
- `src/frontend/components/ui/section-header.tsx` (create)
- `src/frontend/components/fragments/admin/stat-card.tsx` (create)
