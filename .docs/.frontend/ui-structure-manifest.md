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

**Reusable UI blocks, slightly domain-aware.** These are now separated by audience.

#### `fragments/admin`

- `step-header.tsx`: Standard header for multi-step wizards.
- `wizard-footer.tsx`: Standard bottom action bar.
- `detail-header.tsx`: Detailed data headers.
- `navbar.tsx`: Complex authenticated navigation.

#### `fragments/public`

- `simple-navbar.tsx`: Minimal navigation for public pages.

### 3. `src/frontend/features` (Domain UI)

**Stateful, domain-aware components.** Grouped by audience (`admin` vs `public`).

#### Admin Features (`src/frontend/features/admin`)

- `dashboard`: Main portfolio overview.
- `holdings-list`: Detailed portfolio list.
- `holdings-create`: Add new purchase wizard.
- `holdings-detail`: Performance analysis.

#### Public Features (`src/frontend/features/public`)

- `login`: Authentication flow.
- `prices-list`: Public market prices.
- `prices-history`: Historical charts.

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
2. **Grouped Features**: Features must be grouped into `admin/` or `public/` directories. No loose features in root of `src/frontend/features`.
3. **Typography Standard**: All text must be rendered via the `<Typography />` component.
4. **Layout Primitives**: All spacing and alignment must use `<Stack />`, `<Section />`, and `<Container />`.
5. **Shadcn as Primitives**: Shadcn components are treated as foundational primitives.
