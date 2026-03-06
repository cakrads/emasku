# [0148] i18n for Hardcoded Theme and Language Labels in SharedNavbar

**Severity**: Low
**Category**: i18n / Code Quality

## Description

`SharedNavbar` renders hardcoded English strings for theme and language toggles ('Light mode', 'Dark mode', 'English', 'Bahasa Indonesia') instead of using the `t()` function. This breaks i18n consistency.

Affected locations:
- Sheet menu theme toggle: `shared-navbar.tsx` ~line 247
- Desktop dropdown theme toggle: `shared-navbar.tsx` ~line 332
- Sheet menu language toggle: `shared-navbar.tsx` ~line 255
- Desktop dropdown language toggle: `shared-navbar.tsx` ~line 340

## Scope

- Add translation keys to `src/i18n/locales/en.ts` and `src/i18n/locales/id.ts`:
  - `common.lightMode` (e.g. "Light Mode" / "Mode Terang")
  - `common.darkMode` already exists — verify it covers the toggle label
  - `common.languageEnglish` (e.g. "English" / "Bahasa Inggris")
  - `common.languageBahasa` (e.g. "Bahasa Indonesia")
- Replace all four hardcoded string occurrences in `SharedNavbar` with `t()` calls using the new keys

## Acceptance Criteria

- No literal English strings for theme/language toggles in `SharedNavbar`
- Both sheet and dropdown menus use `t()` for all labels
- Both `en` and `id` locale files have the new keys
