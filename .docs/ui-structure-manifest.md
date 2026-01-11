# UI Component Structure Manifest

This document snapshots the component architecture as of January 1st, 2026, following the comprehensive UI Architecture Enforcement.

## 🏗️ Layered Architecture

We follow a strict four-layer architecture to ensure modularity and maintainability.

### 1. `src/frontend/components/ui` (Primitives)

**Stateless, domain-agnostic atoms and molecules.** These replace all raw HTML tags.

- `typography.tsx`: **[NEW]** Centralized text rendering (`Typography` component).
- `layout.tsx`: **[NEW]** Layout blocks (`Container`, `PageWrapper`, `Stack`, `Section`, `ScrollArea`, `Divider`).
- `badge.tsx`: **[NEW]** Status and category indicators.
- `button.tsx`: **[CUSTOMIZED]** Action component supporting `color` (primary/warning/error), `fullWidth`, and standard variants.
- `card.tsx`: Structural containers (Shadcn).
- `input.tsx`: Standard text input (Shadcn).
- `label.tsx`: Standard form label (Shadcn) with cursor pointer support.
- `checkbox.tsx`: **[CUSTOMIZED]** Standard checkbox with fixed cursor pointer.
- `popover.tsx`, `calendar.tsx`: Components for date selection.
- `date-picker.tsx`: Reusable combination of Popover + Calendar.

### 2. `src/frontend/components/fragments` (Organisms)

**Reusable UI blocks, domain-agnostic.** These encapsulate common UI patterns across features.

- `step-header.tsx`: Standard header for multi-step wizards.
- `wizard-footer.tsx`: Standard bottom action bar for wizards.
- `detail-header.tsx`: Standard header for entity detail pages (Brand, Weight, Stat).
- `detail-actions.tsx`: Standard bottom action group for detail pages (Uses refactored Button props).

### 3. `src/frontend/features` (Domain UI)

**Stateful, domain-aware components.** Organized by feature area using a **FLAT naming convention**. These MUST compose UI primitives and fragments.

#### Dashboard (`src/frontend/features/dashboard`)

- `dashboard-view.tsx`: Parent page orchestrator.
- `components/`: Feature-specific sub-components.

#### Holdings Features (Flattened)

- `holdings-list`: Main portfolio overview.
- `holdings-create`: Add new purchase wizard.
- `holdings-detail`: Performance analysis for a single holding.
- `holdings-edit`: Update existing holding details.
- `holdings-brand-category`: Holdings grouped by brand.

## 🎨 Design System & Constants

### Button Component Rules

When using `<Button />`, prioritize specific props over `className` overrides:

- **Colors**:
  - `color="primary"`: For main actions (Submit, Add New). Matches `--accent-gold`.
  - `color="warning"`: For important but destructive actions (Mark as Sold, Sell).
  - `color="error"`: For critical destructive actions (Delete Account, Danger zones).
- **Layout**:
  - `fullWidth`: Use this instead of `className="w-full"`.
  - `size="xl"`: Use for major standalone page actions (h-14).
  - `rounded="xl"`: Standard rounding for primary mobile actions.

## 🛠️ Strict Architectural Rules

1. **Zero Raw HTML**: No `div`, `p`, `h1-6`, `section`, `header`, `footer` outside `components/ui`. Use `Stack`, `Section`, `Typography` instead.
2. **Flattened Features**: Feature folders must follow the `holdings-*` pattern instead of nested `holdings/` subdirectories.
3. **Typography Standard**: All text must be rendered via the `<Typography />` component.
4. **Layout Primitives**: All spacing and alignment must use `<Stack />`, `<Section />`, and `<Container />`.
5. **Shadcn as Primitives**: Shadcn components are treated as foundational primitives.
