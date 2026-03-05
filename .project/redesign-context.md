# Admin Redesign — Context & Design Direction

> **Purpose**: This document captures the full design concept so any AI agent or developer can pick up the redesign without re-explanation. Read this before working on any `[redesign]` backlog task.

---

## Design Vision

Redesign all admin pages to follow a **Wise.com-inspired clean financial UI**. The goal is a mobile-first, light-dominant, typographically bold layout that puts **numbers and values front-and-center** with everything else fading into supporting roles.

**Secondary inspiration**: Bank Jago — for its colorful 2-column card grids (useful for brand breakdown / goals sections).

---

## Reference Images

All reference screenshots are stored in `.project/images-reference/`:

| File | What It Shows |
|---|---|
| `Wise Android 38.png` | Mobile home — Account heading, filter chips (All/Interest), 2-column currency cards (flag + amount + label), Transactions section with "See all" link, transaction rows (icon + desc + amount), bottom tab bar |
| `Wise iOS 42.png` | Mobile home — avatar + CTA badge, "Welcome to Wise", action chips row (Send, Add money, Request), currency card (flag + account number + amount), Transactions + "See all", bottom tab bar |
| `Wise iOS 180.png` | Transaction detail — back nav, centered circle icon, amount hero, timeline stepper (checkmarks + status), "Cancel transfer" CTA at bottom |
| `Wise Web 16.png` | Web onboarding — centered content, icon + title + description action list, "Decide later" text link |
| `Wise Web 17.png` | Web dashboard — left sidebar nav, "Account" heading, single currency card (+Open), Transactions section, "Spend anywhere" promo card |
| `Wise Web 24.png` | Web dashboard with data — left sidebar, "Account" heading, filter chips, 4-column currency cards (flag + amount + label), Transactions with rows, promo section |
| `Wise Web 44.png` | Web send flow — step progress bar (Amount/You/Recipient/Review/Pay), input fields, fee breakdown, green "Continue" button |
| `WhatsApp Image ... (1).jpeg` | Bank Jago detail — colored header background, icon/emoji, centered amount, 3 circle action buttons row, white card sections, search bar |
| `WhatsApp Image ....jpeg` | Bank Jago home — bold title, search bar, segmented tabs, 2-column colorful card grid (icon + name + amount per card), bottom tab bar |

---

## Core Design Principles (extracted from Wise)

### 1. Numbers Are Heroes
- Portfolio total value: **extra-large, bold, dark**
- PnL values: large with semantic color (green/red)
- Everything else (labels, timestamps, descriptions) is **small and muted**

### 2. Pure White Base
- Page background: `#FFFFFF` (pure white)
- Cards: very light gray (`#F5F5F5` or `bg-surface`) with rounded-xl corners
- No heavy shadows — use subtle `shadow-sm` at most or just a border

### 3. Generous Whitespace
- Sections separated by clear vertical spacing (gap-8 to gap-12)
- Cards have comfortable internal padding (p-4 to p-6)
- Content does NOT feel cramped

### 4. Chip-Based Quick Actions
- Primary actions presented as small pill-shaped buttons in a horizontal row
- Example: "Tambah Emas" (gold pill), "Jual" (outline), "Riwayat" (outline)
- NOT large full-width buttons for navigation actions

### 5. Transaction/Holding Rows
- Icon circle (left) + name + meta (center) + value + sub-value (right)
- Clean horizontal dividers between rows
- "See all" as a text link, not a button

### 6. Section Headings
- Bold, left-aligned, with an optional right-aligned text-link ("See all", "Filter")
- No decorative borders or backgrounds on headings

### 7. Two-Column Card Grid
- Used for: currency cards (Wise), brand holdings (emasku), goal cards
- Each card: icon/logo top, value prominent, label small below
- Rounded-xl, consistent height, equal gap

### 8. Bottom Tab Navigation (Mobile)
- 4-5 items: Home, Holdings, [Add FAB], Prices, Profile
- Active state: filled icon + label, gold accent
- Clean, no background color on the bar (just a top border)

---

## Color Mapping: Wise → Emasku

| Wise | Emasku | CSS Token |
|---|---|---|
| Wise Green (primary CTA) | Gold | `--accent-gold` (#D4AF37 light / #F5C518 dark) |
| White background | Same | `--background` |
| Light gray cards | Same | `--surface` (#F9FAFB) |
| Dark text | Same | `--foreground` |
| Gray supporting text | Same | `--text-secondary` (#6B7280) |
| Green status (success) | Profit green | `--positive` (#10B981) |
| Red status (error) | Loss red | `--negative` (#EF4444) |

---

## Theme Strategy

**Light-first with maintained dark mode support.** The light theme is the "primary" design matching Wise. Dark mode continues to work (already has tokens) but light is the design benchmark for all new work.

---

## Page-by-Page Mapping

### Dashboard
- **Hero**: Large portfolio total value + privacy toggle (eye icon)
- **Quick actions**: Horizontal pill chips row (Tambah Emas, Jual, Riwayat Harga)
- **Market today**: Horizontal scroll cards showing buy/sell prices per brand
- **Brand breakdown**: 2-column card grid (brand icon + weight + value per card)
- **Holdings preview**: Clean list rows (brand + weight left, value + PnL right) + "See all" link
- **Goals section**: Progress cards showing active goals

### Holdings List
- **Summary bar**: 4 compact metric cards in a row (total weight, buy value, current value, PnL)
- **Filter**: Chip-based filter row (brand, status, sort) — not a modal by default
- **Table/List**: Clean rows with brand icon, weight, buy price, current value, PnL
- **Pagination**: Simple numbered pagination or load more

### Holding Detail
- **Hero**: Large current value + PnL badge
- **Info cards**: Clean stacked cards for purchase details, valuation, sell info
- **Actions**: Pill buttons (Edit, Mark Sold, Delete) — not full-width

### Holdings Create (Add Wizard)
- **Step indicator**: Linear progress (like Wise's Amount → You → Recipient → Review → Pay)
- **Brand selection**: 2-column grid with brand logos
- **Weight selection**: Clean denomination chips
- **Review**: Summary card before submit

### Goals (List, Create, Detail, Edit)
- Follow the same card and list patterns
- Goal cards: icon + name + progress bar + current/target amounts

### Profile
- Clean card-based sections (account info, preferences, danger zone)
- Toggle switches for dark mode and language

### Buyback Simulation
- Clean selection list with checkboxes
- Floating summary bar at bottom (mobile)
- Confirmation modal before bulk sell

---

## Implementation Order

The redesign should be implemented in this sequence (each is a separate backlog task):

1. **[initial] Design tokens** — Update `globals.css` to refine light-mode tokens
2. **[component] Core UI primitives** — Update Card, Typography variants, layout primitives
3. **[component] Navigation** — Redesign SharedNavbar + bottom tab bar
4. **[component] Shared fragments** — Update detail-actions, empty-state, step-header, etc.
5. **[dashboard]** — Redesign the dashboard page
6. **[holdings-list]** — Redesign the holdings list page
7. **[holdings-detail]** — Redesign the holding detail page
8. **[holdings-create]** — Redesign the add holding wizard
9. **[goals]** — Redesign all goal pages (list, create, detail, edit)
10. **[profile]** — Redesign the profile page
11. **[buyback]** — Redesign the buyback simulation page

---

## Current Admin Page Inventory

| # | Page | Route | View File |
|---|---|---|---|
| 1 | Dashboard | `/dashboard` | `features/admin/dashboard/dashboard-view.tsx` |
| 2 | Holdings List | `/holdings` | `features/admin/holdings-list/holdings-list-view.tsx` |
| 3 | Holdings Create | `/holdings/create` | `features/admin/holdings-create/add-holding-view.tsx` |
| 4 | Holding Detail | `/holdings/[holdingId]` | `features/admin/holdings-detail/holding-detail-view.tsx` |
| 5 | Holding Edit | `/holdings/[holdingId]/edit` | `features/admin/holdings-edit/edit-holding-view.tsx` |
| 6 | Buyback Simulation | `/buyback-simulation` | `features/admin/buyback-simulation/buyback-simulation-view.tsx` |
| 7 | Goals List | `/goals` | `features/admin/goals-list/goals-list-view.tsx` |
| 8 | Goal Create | `/goals/create` | `features/admin/goals-create/goal-create-view.tsx` |
| 9 | Goal Detail | `/goals/[goalId]` | `features/admin/goals-detail/goal-detail-view.tsx` |
| 10 | Goal Edit | `/goals/[goalId]/edit` | `features/admin/goals-edit/goal-edit-view.tsx` |
| 11 | Profile | `/profile` | `features/admin/profile/profile-view.tsx` |

**Shared layout**: `shared-navbar.tsx` (desktop top nav + mobile bottom tab bar), `standard-page-layout.tsx`

**Shared fragments**: `detail-actions.tsx`, `detail-header.tsx`, `empty-state.tsx`, `error-boundary.tsx`, `logout-dialog.tsx`, `step-header.tsx`, `wizard-footer.tsx`
