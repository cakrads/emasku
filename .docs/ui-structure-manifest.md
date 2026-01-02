# UI Component Structure Manifest

This document snapshots the component architecture as of January 1st, 2026, following the comprehensive UI Architecture Enforcement.

## 🏗️ Layered Architecture

We follow a strict four-layer architecture to ensure modularity and maintainability.

### 1. `src/frontend/components/ui` (Primitives)

**Stateless, domain-agnostic atoms and molecules.** These replace all raw HTML tags.

- `typography.tsx`: **[NEW]** Centralized text rendering (`Typography` component).
- `layout.tsx`: **[NEW]** Layout blocks (`Container`, `PageWrapper`, `Stack`, `Section`, `ScrollArea`, `Divider`).
- `badge.tsx`: **[NEW]** Status and category indicators.
- `button.tsx`: Shared action component (Shadcn).
- `card.tsx`: Structural containers (Shadcn).
- `input.tsx`: Standard text input (Shadcn).
- `label.tsx`: Standard form label (Shadcn).
- `popover.tsx`, `calendar.tsx`: Components for date selection.
- `date-picker.tsx`: Reusable combination of Popover + Calendar.

### 2. `src/frontend/components/fragments` (Organisms)

**Reusable UI blocks, domain-agnostic.** These encapsulate common UI patterns across features.

- `step-header.tsx`: Standard header for multi-step wizards.
- `wizard-footer.tsx`: Standard bottom action bar for wizards.
- `detail-header.tsx`: Standard header for entity detail pages (Brand, Weight, Stat).
- `detail-actions.tsx`: Standard bottom action group for detail pages.

### 3. `src/frontend/features` (Domain UI)

**Stateful, domain-aware components.** Organized by feature area. These MUST compose UI primitives and fragments.

#### Dashboard (`src/frontend/features/dashboard`)

- `dashboard-view.tsx`: Parent page orchestrator.
- `components/`: Feature-specific sub-components (`PortfolioHero`, `BrandCard`, etc.).

#### Add Holding (`src/frontend/features/add-holding`)

- `add-holding-view.tsx`: Multi-step gold purchase wizard.

#### Holding Detail (`src/frontend/features/holding-detail`)

- `holding-detail-view.tsx`: Value analysis and holding specifics.

## 🛠️ Strict Architectural Rules

1. **Zero Raw HTML**: No `div`, `p`, `h1-6`, `section`, `header`, `footer` outside `components/ui`. Use `Stack`, `Section`, `Typography` instead.
2. **Dependency Direction**: `app` → `feature` → `fragment` → `ui`. Features must never import from other features.
3. **Typography Standard**: All text must be rendered via the `<Typography />` component for semantic and style consistency.
4. **Layout Primitives**: All spacing and alignment must use `<Stack />`, `<Section />`, and `<Container />`.
5. **Shadcn as Primitives**: Shadcn components are treated as foundational primitives.
