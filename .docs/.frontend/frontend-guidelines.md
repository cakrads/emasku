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

- **Imports**: Favor absolute aliases (e.g., `@/frontend/features/holdings-list/components/...`).
- **Standard Layout**: Every feature view should wrap its content in `<StandardPageLayout />` from `@/frontend/components/layout/standard-page-layout`.
- **Typography**: Never use raw `h1-h6` or `p`. Use `<Typography variant="..." />`.
- **Layout Primitives**: Use `<Stack />`, `<Section />`, and `<Container />` for all spacing.
- **Interactivity**: Labels and Checkboxes must have `cursor-pointer`.
