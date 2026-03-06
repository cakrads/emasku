# [0137][redesign][component] Navigation Redesign

**Severity**: High
**Category**: Frontend / Design System
**Estimated Effort**: Medium
**Depends On**: `[0135]` Design tokens, `[0136]` Core UI primitives
**Blocks**: All page-level `[redesign]` tasks

## Context

> Read `.project/redesign-context.md` for full design direction and reference images.

The current `SharedNavbar` handles both desktop (top bar) and mobile (bottom tab bar). The navigation needs to be refined to match Wise's clean navigation pattern.

## Description

Redesign the navigation to be cleaner, less visually heavy, and more aligned with the Wise aesthetic. The mobile bottom tab bar should feel like a native financial app.

## Current State

`src/frontend/components/layout/shared-navbar.tsx` is a single component that:
- Desktop: Horizontal top bar with logo, nav links (Dashboard, Holdings, Goals, Prices), theme toggle, language toggle, profile dropdown
- Mobile (authenticated): Bottom tab bar with 5 items (Dashboard, Holdings, center Add FAB, Prices, Profile)
- Mobile (guest): Hamburger sheet menu

## Scope

### Mobile Bottom Tab Bar

- [ ] Redesign the bottom tab bar to match Wise:
  - Clean white background with a subtle top border (`border-t border-border`)
  - 5 items: Dashboard (home icon), Holdings (layers/stack icon), Add (center gold FAB circle), Prices (chart icon), Profile (user icon)
  - Active state: gold accent color on icon + label, inactive: muted gray
  - Icons: use lucide-react icons, size 20-24px
  - Labels: `text-[10px]` or `text-xs`, below icons
  - The center FAB: a gold circle button (`bg-accent-gold`, `rounded-full`, `shadow-gold`) raised above the bar
  - No background color on the bar itself — clean white/card background
- [ ] Smooth transition when switching tabs (optional: subtle scale animation on active icon)

### Desktop Top Navigation

- [ ] Simplify the desktop nav bar:
  - Clean white background with subtle bottom border
  - Logo left, nav links center, profile avatar + dropdown right
  - Active nav link: gold underline or bold text, not a background highlight
  - Keep theme toggle and language toggle in the profile dropdown (not in the main bar)
- [ ] Consider a narrow left sidebar option (like Wise web) as a future enhancement — NOT in scope for this task

### Hide on Form Pages

- [ ] Maintain current behavior: bottom tab bar is hidden on create/edit/wizard pages (mobile)
- [ ] On form pages, the `StepHeader` or `DetailActions` replaces the nav

## Acceptance Criteria

- Mobile bottom tab bar matches Wise's clean style with gold accent
- Desktop nav is cleaner and less visually heavy
- Active/inactive states are clear and use design tokens
- Navigation works correctly on all admin routes
- `npm run build` passes
- No regressions on public/guest pages

## Files Modified

- `src/frontend/components/layout/shared-navbar.tsx` (major rewrite)
- Possibly split into `desktop-navbar.tsx` and `mobile-tab-bar.tsx` for clarity
