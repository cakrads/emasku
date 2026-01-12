TASK: Implement Language-Aware UX (i18n) with Indonesian-First Experience

CONTEXT
Project: Emasku

Current UI text is mixed between Indonesian and English.
This creates inconsistency and poor UX.

We want to:

- Standardize language handling
- Default to Indonesian for users
- Support English for professional / portfolio context
- Go beyond simple translation by adjusting tone and UX copy per language

This task focuses on **frontend language architecture and UX copy structure**.

---

LANGUAGE STRATEGY (FINAL DECISION)

1. Default language: Indonesian (id)
2. Secondary language: English (en)
3. Codebase language: English only
4. No hardcoded UI text in components
5. Language affects:
   - wording
   - tone
   - clarity
   - user guidance

---

DESIGN PRINCIPLES

- Indonesian copy:
  - Friendly
  - Clear
  - Slightly conversational
  - Helps first-time users

- English copy:
  - Professional
  - Neutral
  - Concise
  - Portfolio / reviewer friendly

Do NOT do literal word-by-word translation.
Each language may have slightly different phrasing.

---

FILE STRUCTURE (MANDATORY)

Use the following structure:

src/i18n/
config.ts  
index.ts  

src/i18n/locales/
id.ts  
en.ts  

---

STEP 1: I18N CONFIGURATION

config.ts responsibilities:

- Define supported languages
- Define default language
- Expose language type

Rules:

- No UI logic
- No environment access here

---

STEP 2: LOCALE FILES (COPY-AWARE)

Create locale files that reflect **UX intent**, not literal translation.

Example:

id.ts:

- "Tambah Emas"
- "Belum ada emas di portofoliomu"
- "Grafik akan muncul setelah kamu menambahkan emas"

en.ts:

- "Add Gold"
- "You don't have any gold yet"
- "Charts will appear once you add your first holding"

Copy may differ slightly as long as intent is preserved.

---

STEP 3: TRANSLATION HELPER

Implement a simple translation helper:

Responsibilities:

- Resolve nested keys (e.g. dashboard.empty.title)
- Return key if translation missing (safe fallback)
- Use current active language

Avoid:

- heavy i18n libraries
- ICU message formatting
- overengineering

---

STEP 4: LANGUAGE STATE MANAGEMENT

Implement language state:

- Default language = Indonesian
- Detect preferred language:
  - localStorage (if exists)
  - fallback to default
- Provide setter to switch language

Rules:

- No re-render hacks
- No context overuse
- Simple and predictable

---

STEP 5: MIGRATE EXISTING UI TEXT

Systematically replace:

- Hardcoded strings in components
- Mixed-language labels

With:

- translation keys

Rules:

- Group keys by feature (dashboard, prices, holdings)
- Do NOT create one massive "common" file
- Use semantic keys, not sentence-based keys

---

STEP 6: LANGUAGE-AWARE UX COPY

Ensure the following components use language-appropriate copy:

- Dashboard empty states
- Call-To-Action buttons
- Section titles
- Helper texts
- Confirmation messages

Avoid:

- slang
- jokes
- culturally specific metaphors

Keep tone:

- Calm
- Trustworthy
- Financial-app appropriate

---

STEP 7: OPTIONAL LANGUAGE SWITCHER (NO UI YET)

Prepare infrastructure for:

- Language toggle (id / en)
- Persist choice in localStorage

Do NOT:

- Implement switch UI
- Expose toggle in navbar yet

Infrastructure only.

---

STEP 8: VALIDATION CHECKLIST

After implementation:

- No visible mixed-language text
- Switching language updates all UI text
- Missing keys fail gracefully
- No component contains hardcoded UI copy

---

OUT OF SCOPE

- Date / currency locale formatting
- RTL language support
- Backend internationalization
- Content marketing copy

---

DELIVERABLES

- i18n folder and configuration
- Locale files with thoughtful copy
- Updated components using translation helper
- Clean, consistent UI language experience

---

QUALITY BAR

- Clean structure
- Easy to extend
- UX-appropriate wording
- No overengineering
- Professional-grade result
