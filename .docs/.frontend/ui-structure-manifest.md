# UI Component Structure Manifest

This document snapshots the component architecture as of March 2026.

## 🏗️ Layered Architecture

We follow a strict four-layer architecture to ensure modularity and maintainability.

### 1. `src/frontend/components/ui` (Primitives)

**Stateless, domain-agnostic atoms and molecules.** These replace all raw HTML tags.

- `typography.tsx`: Centralized text rendering (`Typography` component).
- `layout.tsx`: Layout blocks (`Container`, `PageWrapper`, `Stack`, `Section`, `ScrollArea`, `Divider`).
- `badge.tsx`: Status and category indicators.
- `button.tsx`: Action component supporting `color` (primary/warning/error), `fullWidth`, and standard variants.
- `card.tsx`: Structural containers (Shadcn).
- `input.tsx`: Standard text input (Shadcn).
- `label.tsx`: Standard form label (Shadcn) with cursor pointer support.
- `checkbox.tsx`: Standard checkbox with fixed cursor pointer.
- `popover.tsx`, `calendar.tsx`: Components for date selection.
- `date-picker.tsx`: Reusable combination of Popover + Calendar.
- `dialog.tsx`: Modal dialog (Shadcn).
- `responsive-modal.tsx`: Responsive modal (drawer on mobile, dialog on desktop).
- `sheet.tsx`: Side panel overlay (Shadcn).
- `alert.tsx`: Alert messages.
- `alert-dialog.tsx`: Confirmation dialogs.
- `dropdown-menu.tsx`: Dropdown menus.
- `avatar.tsx`: User avatar.
- `breadcrumb.tsx`: Navigation breadcrumbs.
- `chart-renderer.tsx`: Reusable chart rendering component.
- `currency-input.tsx`: Formatted currency input.
- `empty.tsx`: Empty state placeholder.
- `page-header.tsx`: Page header with back navigation.
- `privacy-toggle.tsx`: Toggle for hiding sensitive financial data.
- `responsive-info-tip.tsx`: Context-aware information tooltip.
- `scroll-reveal.tsx`: Scroll-triggered reveal animations.
- `skeleton.tsx`: Loading skeleton placeholder.
- `sonner.tsx`: Toast notification (Sonner).
- `switch.tsx`: Toggle switch.
- `theme-toggle.tsx`: Dark/light theme toggle.
- `tooltip.tsx`: Tooltip component.

### 2. `src/frontend/components/fragments` (Organisms)

**Reusable UI blocks, slightly domain-aware.** Separated by audience.

#### `fragments/admin`

- `step-header.tsx`: Standard header for multi-step wizards.
- `wizard-footer.tsx`: Standard bottom action bar.
- `detail-header.tsx`: Detailed data headers.
- `detail-actions.tsx`: Action buttons for detail views.
- `empty-state.tsx`: Empty state with action prompts.
- `error-boundary.tsx`: Error boundary with fallback UI.
- `logout-dialog.tsx`: Logout confirmation dialog.

#### `fragments/public`

- `simple-footer.tsx`: Footer for public pages.

### 3. `src/frontend/components/layout` (Layouts)

- `standard-page-layout.tsx`: Standard wrapper for every feature page.
- `shared-navbar.tsx`: Complex navigation bar (adapts for admin/public).

### 4. `src/frontend/features` (Domain UI)

**Stateful, domain-aware components.** Grouped by audience (`admin` vs `public`).

#### Admin Features (`src/frontend/features/admin`)

- `dashboard`: Main portfolio overview.
- `holdings-list`: Detailed portfolio list with filters.
- `holdings-create`: Add new purchase wizard.
- `holdings-detail`: Individual holding performance analysis.
- `holdings-edit`: Edit existing holding details.
- `holdings-brand-category`: Holdings grouped by brand category.
- `buyback-simulation`: Simulate buyback scenarios.
- `goals-list`: Savings goals overview.
- `goals-create`: Create new savings goal wizard.
- `goals-detail`: Goal progress and allocation detail.
- `goals-edit`: Edit existing goal.
- `profile`: User profile management.

#### Public Features (`src/frontend/features/public`)

- `login`: Authentication flow.
- `prices-list`: Public market prices.
- `prices-history`: Historical price charts.
- `landing`: Public landing/marketing page.
- `privacy`: Privacy policy page.

## 🎨 Design System & Constants

### Button Component Rules

When using `<Button />`, prioritize specific props over `className` overrides:

- **Colors**:
  - `color="primary"`: For main actions (Submit, Add New). Matches `--accent-gold`.
  - `color="warning"`: For important but non-destructive actions (Mark as Sold, Sell).
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
