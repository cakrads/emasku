# [0147][chore][admin] Fix className violations in admin features

**Severity**: Medium
**Category**: Frontend / Code Quality
**Estimated Effort**: Small
**Related**: Codebase-wide design-token enforcement (see also 0148, 0149)

---

## Context

The project forbids arbitrary Tailwind values (`text-[10px]`, `bg-[#fff]`) and raw Tailwind color
palette classes (`text-green-600`, `bg-orange-100`). Design tokens defined in `globals.css`
(`@theme inline {}`) must be used instead. This ticket cleans up all remaining violations in
`src/frontend/features/admin/`.

---

## Token Mapping Reference

Use **only** these replacements. Do not invent new tokens.

| Raw class(es) | Replace with |
|---|---|
| `text-[10px]` | `text-2xs` |
| `text-[11px]` | `text-2xs` (close enough — no 11px token exists) |
| `text-[var(--foreground-muted)]` | `text-muted-foreground` |
| `bg-[var(--surface)]` | `bg-surface` |
| `bg-[var(--surface-elevated)]` | `bg-surface-elevated` |
| `bg-[var(--border)]`, `border-[var(--border)]` | `bg-border`, `border-border` |
| `text-green-600 dark:text-green-400` | `text-positive` |
| `text-red-600 dark:text-red-400` | `text-negative` |
| `text-red-500` | `text-negative` |
| `text-amber-600 dark:text-amber-400` | `text-accent-gold` |
| `text-blue-600 dark:text-blue-400` | `text-primary` |
| `text-gray-500 dark:text-gray-400` | `text-muted-foreground` |
| `text-zinc-900 dark:text-*` | `text-foreground` |
| `text-zinc-600 dark:text-*` | `text-muted-foreground` |
| `bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50` | `bg-positive/5 border-positive/20` |
| `bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50` | `bg-negative/5 border-negative/20` |
| `bg-zinc-50 border-zinc-200 dark:bg-blue-950/20 dark:border-blue-900/50` | `bg-muted border-border` |

### ⚠️ DO NOT replace these — no equivalent token exists

- `bg-orange-*`, `text-orange-*`, `ring-orange-*` — orange has no design token. Leave as-is and add comment `{/* TODO: no orange token — leave */}` above the line.
- `bg-blue-500/10 text-blue-500` (tools-modal.tsx icons) — accent color with no token. Leave as-is.
- `bg-purple-500/10 text-purple-500` (tools-modal.tsx icons) — Leave as-is.
- `style={{ width: \`...\` }}` on progress bars — dynamic inline style is required here. Leave as-is.
- `style={{ height: '200px' }}` (portfolio-chart.tsx) — recharts container requires explicit pixel height. Leave as-is.

---

## Files to Fix

### 1. `src/frontend/features/admin/holdings-list/components/portfolio-summary-section.tsx`

**Lines ~194, ~200, ~203**

- Line 194: `text-[11px]` → `text-2xs`
- Line 200: `text-[10px]` → `text-2xs`
- Line 203: `text-amber-600 dark:text-amber-400 text-[11px]` → `text-accent-gold text-2xs`

---

### 2. `src/frontend/features/admin/holdings-list/components/compact-brand-card.tsx`

**Line ~99**

- `text-[11px]` → `text-2xs`

---

### 3. `src/frontend/features/admin/holdings-list/components/portfolio-summary-card.tsx`

**Lines ~66, ~81**

- Both: `text-[11px]` → `text-2xs`

---

### 4. `src/frontend/features/admin/holdings-list/components/filter-bar.tsx`

**Lines ~34, ~38-39, ~45, ~55, ~59, ~65, ~87, ~91-92, ~98**

This file uses CSS variable syntax in className which is invalid Tailwind. Replace all occurrences:

- `text-[var(--foreground-muted)]` → `text-muted-foreground` (4 occurrences)
- `bg-[var(--surface-elevated)]` → `bg-surface-elevated`
- `bg-[var(--surface)]` → `bg-surface` (3 occurrences on `<select>` elements)
- `border-[var(--border)]` → `border-border` (multiple occurrences)
- `bg-[var(--border)]` → `bg-border` (divider `<div>` elements, 2 occurrences)
- `focus:ring-[var(--foreground)]` → `focus:ring-foreground`

---

### 5. `src/frontend/features/admin/goals-detail/goal-detail-view.tsx`

**Lines ~324, ~335**

- Both: `text-[10px]` → `text-2xs`

---

### 6. `src/frontend/features/admin/goals-detail/hooks/use-goal-detail-metrics.ts`

**Lines ~88, ~90, ~92, ~93**

- Line 88: `'text-green-600 dark:text-green-400'` → `'text-positive'`
- Line 90: `'text-green-600 dark:text-green-400'` → `'text-positive'`
- Line 92: `'text-blue-600 dark:text-blue-400'` → `'text-primary'`
- Line 93: `'text-gray-500 dark:text-gray-400'` → `'text-muted-foreground'`

---

### 7. `src/frontend/features/admin/holdings-brand-category/components/holdings-table.tsx`

**Line ~124** (orange badge span — leave orange, fix only text-[10px]):

```tsx
// BEFORE
<span className="inline-flex items-center rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
// AFTER
<span className="inline-flex items-center rounded-md bg-orange-100 px-1.5 py-0.5 text-2xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
```

**Line ~311**:

- `text-[10px]` → `text-2xs`

---

### 8. `src/frontend/features/admin/dashboard/components/prices-today-cards.tsx`

**Lines ~40, ~76, ~81, ~118, ~123**

All occurrences of `text-[10px]` → `text-2xs`. There are **5** occurrences total.

Example on line 40 (ternary):
```tsx
// BEFORE
<span className={delta > 0 ? "text-[10px] text-positive font-semibold" : delta < 0 ? "text-[10px] text-negative font-semibold" : "text-[10px] text-muted-foreground/60 font-semibold"}>
// AFTER
<span className={delta > 0 ? "text-2xs text-positive font-semibold" : delta < 0 ? "text-2xs text-negative font-semibold" : "text-2xs text-muted-foreground/60 font-semibold"}>
```

---

### 9. `src/frontend/features/admin/holdings-create/components/purchase-form.tsx`

**Line ~71**:

- `text-[10px]` → `text-2xs`

**Line ~52** (required asterisk):

```tsx
// BEFORE
{t('addHolding.details.purchasePrice')} <span className="text-red-500" aria-hidden="true">*</span>
// AFTER
{t('addHolding.details.purchasePrice')} <span className="text-negative" aria-hidden="true">*</span>
```

---

### 10. `src/frontend/features/admin/holdings-detail/components/valuation-card.tsx`

**Lines ~23–26**:

```tsx
// BEFORE
<Alert className="bg-zinc-50 border-zinc-200 dark:bg-blue-950/20 dark:border-blue-900/50">
  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
  <AlertTitle className="text-zinc-900 dark:text-blue-100">...</AlertTitle>
  <AlertDescription className="text-zinc-600 dark:text-blue-300">
// AFTER
<Alert className="bg-muted border-border">
  <Info className="h-4 w-4 text-primary" />
  <AlertTitle className="text-foreground">...</AlertTitle>
  <AlertDescription className="text-muted-foreground">
```

---

### 11. `src/frontend/features/admin/holdings-detail/components/sell-modal.tsx`

**Lines ~156–157** (PnL preview banner):

```tsx
// BEFORE
preview.color === 'positive' ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50' :
  preview.color === 'negative' ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50' :
// AFTER
preview.color === 'positive' ? 'bg-positive/5 border-positive/20' :
  preview.color === 'negative' ? 'bg-negative/5 border-negative/20' :
```

**Lines ~186–187** (orange warning — leave as-is, no token):
```
// DO NOT TOUCH: text-orange-* / bg-orange-* — no design token exists
```

---

### 12. `src/frontend/features/admin/buyback-simulation/components/bulk-sell-modal.tsx`

**Lines ~117–129** (warning banners):

- `bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/50` — **LEAVE as-is** (no orange token)
- `text-orange-600 dark:text-orange-400` — **LEAVE as-is**
- `text-orange-800 dark:text-orange-200` — **LEAVE as-is**
- `bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50` → `bg-negative/5 border-negative/20`
- `text-red-600 dark:text-red-400` → `text-negative`
- `text-red-800 dark:text-red-200` → `text-negative`

---

## Verification

After all edits, run these checks:

```bash
# Should return 0 results (excluding this ticket file itself):
grep -rn "text-\[" src/frontend/features/admin/
grep -rn "bg-\[var(" src/frontend/features/admin/
grep -rn "text-\[var(" src/frontend/features/admin/
grep -rn "text-green-\|text-red-500\|text-blue-600\|text-gray-500\|text-zinc-\|text-amber-600" src/frontend/features/admin/
grep -rn "bg-green-50\|bg-red-50\|bg-zinc-50" src/frontend/features/admin/

# Build must pass:
npm run build
```

---

## Acceptance Criteria

- [ ] Zero `text-[*]` arbitrary values remaining in `features/admin/`
- [ ] Zero `text-[var(--*)]` / `bg-[var(--*)]` CSS variable syntax in className props
- [ ] Zero raw green/red/blue/gray/zinc color classes remaining (orange/purple/blue-500 exceptions noted above)
- [ ] `npm run build` passes with no errors
- [ ] No visual regressions — color intent is preserved (positive=green, negative=red, accent=gold)
