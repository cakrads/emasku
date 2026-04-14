# [0144][redesign][profile] Profile Page Redesign

**Severity**: Low
**Category**: Frontend / Redesign
**Estimated Effort**: Small
**Depends On**: `[0135]` tokens, `[0136]` components

## Context

> Read `.project/redesign-context.md` for full design direction and reference images.

## Description

Redesign the profile page for a clean, card-based settings layout.

## Current State

**View file**: `src/frontend/features/admin/profile/profile-view.tsx`
No dedicated sub-components — all content is inline in the view file.

## Target Design

### Layout (top to bottom)

1. **User Info Section**
   - Avatar (large circle), display name (Typography h2), email (body-sm muted)
   - Member since date

2. **Preferences Card**
   - Clean card with rows:
     - Dark Mode toggle (switch)
     - Language toggle (EN / ID)
   - Each row: label left, control right, divider between

3. **Privacy & Data Card**
   - Export Data row (with download icon → triggers JSON export)
   - Privacy Policy row (link)

4. **Account Card** (danger zone)
   - Delete Account row (red text, with confirmation dialog)
   - Logout row

### Pattern

Each settings group is a Card with ListRow-style items inside. Clean borders between items. No heavy colors or backgrounds.

## Scope

- [ ] Rewrite `profile-view.tsx` with card-based sections
- [ ] Extract settings rows into sub-components if the file gets large
- [ ] Maintain all existing logic (export, delete, logout, toggles)

## Acceptance Criteria

- Profile page renders with clean card-based layout
- All toggles and actions work correctly
- Delete account and logout confirmations work
- `npm run build` passes

## Files Modified

- `src/frontend/features/admin/profile/profile-view.tsx`
- Possibly create `src/frontend/features/admin/profile/components/` for extracted sub-components
