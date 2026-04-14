# [0148][chore][public] Fix className violations in public features

**Severity**: Low
**Category**: Frontend / Code Quality
**Estimated Effort**: XSmall
**Related**: Codebase-wide design-token enforcement (see also 0147, 0149)

---

## Context

The project forbids arbitrary Tailwind values and raw Tailwind color palette classes. This ticket
cleans up all remaining violations in `src/frontend/features/public/`.

> **Note**: Public (landing page) components are largely decorative / marketing. Some decorative
> uses of `bg-white`, `bg-zinc-950` etc. are intentional for a clean look; the fix below only
> touches the semantic color usages that should match the design token system.

---

## Token Mapping Reference

| Raw class(es) | Replace with |
|---|---|
| `text-green-600 dark:text-green-400` | `text-positive` |
| `text-red-500 dark:text-red-400` | `text-negative` |
| `bg-red-500/10 text-red-500 dark:text-red-400` | `bg-negative/10 text-negative` |
| `text-blue-600 dark:text-blue-400` | `text-primary` |
| `bg-gray-50 dark:bg-zinc-900/80` | `bg-surface` |
| `border-gray-200 dark:border-zinc-800/40` | `border-border` |

### ⚠️ DO NOT replace these — intentional decorative/structural usage

- `bg-white dark:bg-zinc-950` — page/section backgrounds; no semantic token maps here. Leave as-is.
- `bg-white/50 dark:bg-zinc-900/50` (glassmorphism) — decorative. Leave as-is.
- `bg-zinc-900` on phone mock notch (`phone-mock.tsx`) — literal device UI chrome. Leave as-is.
- `bg-[linear-gradient(...)]` with `bg-[size:...]` (`how-it-works-section.tsx`) — decorative grid pattern, no token. Leave as-is.
- `bg-white/50 dark:bg-zinc-900/50` on buttons (`hero-section.tsx`) — decorative glass effect. Leave as-is.

---

## Files to Fix

### 1. `src/frontend/features/public/landing/components/price-section.tsx`

**Lines ~117, ~159** (price trend badges):

```tsx
// BEFORE (both lines follow the same pattern)
item.trend === 'down' ? 'bg-red-500/10 text-red-500 dark:text-red-400' :
// AFTER
item.trend === 'down' ? 'bg-negative/10 text-negative' :
```

> The neutral/unchanged trend class (typically `bg-muted text-muted-foreground`) should remain
> unchanged if it already uses design tokens. Only fix the `red-*` occurrences.

---

### 2. `src/frontend/features/public/landing/components/why-section.tsx`

**Line ~19**:

```tsx
// BEFORE
<section className="py-24 bg-gray-50 dark:bg-zinc-900/80">
// AFTER
<section className="py-24 bg-surface">
```

---

### 3. `src/frontend/features/public/landing/components/proof-section.tsx`

**Line ~17**:

```tsx
// BEFORE
<section className="py-16 border-y border-gray-200 dark:border-zinc-800/40 bg-gray-50 dark:bg-zinc-900/80">
// AFTER
<section className="py-16 border-y border-border bg-surface">
```

---

### 4. `src/frontend/features/public/privacy/privacy-view.tsx`

**Line ~84** (data controller contact):

```tsx
// BEFORE
<Stack direction="horizontal" gap="sm" className="items-center font-semibold text-blue-600 dark:text-blue-400">
// AFTER
<Stack direction="horizontal" gap="sm" className="items-center font-semibold text-primary">
```

**Line ~98** (data rights section):

```tsx
// BEFORE
<Stack direction="horizontal" gap="sm" className="items-center font-semibold text-green-600 dark:text-green-400">
// AFTER
<Stack direction="horizontal" gap="sm" className="items-center font-semibold text-positive">
```

**Line ~47** (destructive alert):

```tsx
// Check current state. If it reads:
<Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive dark:text-red-400">
// Fix the dark: part only:
<Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive">
// (text-destructive already handles theming correctly — dark:text-red-400 is redundant)
```

---

## Verification

After all edits, run these checks:

```bash
# Should return 0 results:
grep -rn "text-green-\|text-red-5\|text-blue-6\|bg-gray-50\|bg-red-500/10" src/frontend/features/public/
grep -rn "text-\[" src/frontend/features/public/

# Build must pass:
npm run build
```

---

## Acceptance Criteria

- [ ] Zero `text-[*]` arbitrary values in `features/public/`
- [ ] Zero semantic raw color classes (`text-green-*`, `text-red-*`, `text-blue-*`) — decorative exceptions noted above are allowed
- [ ] `npm run build` passes with no errors
- [ ] Landing page visual appearance unchanged
