# PROMPT — Dashboard Holdings Preview Section (FINAL)

## Role & Goal

You are a senior frontend engineer implementing a **Holdings Preview section** on the dashboard.

The goal of this section is to:

- Fill unused vertical space on desktop
- Add a sense of depth and completeness to the dashboard
- Provide quick orientation, NOT detailed analysis

This section must feel intentional, lightweight, and read-only.

This is a UX layout enhancement, not a feature expansion.

---

## Product Context

The dashboard already contains:

1. Portfolio summary (estimated sell value)
2. Market Today
3. Brand summary

Holdings Preview is a **supporting section**, not a primary one.

---

## UX Decision (FINAL)

Display a **preview list of recent holdings**, limited in scope and detail.

Do NOT introduce:

- New calculations
- New KPIs
- Charts
- Inline editing
- Sorting or filtering

---

## Section Placement

- Desktop: Below the main dashboard sections
- Mobile: At the very bottom, collapsed by default if needed

Section title:
Holdings Terbaru

yaml
Salin kode

---

## Data Rules

- Show the latest 3–5 holdings (most recently created)
- Read-only
- Use existing holding data only

Each item represents **one holding record**.

---

## Item Layout (Required)

Each holding item must display:

- Brand name
- Denomination (gram)
- Purchase date
- Buy price (total, not per gram)

Example layout:

Antam · 1 gram
Dibeli 12 Jan 2026 · Rp 2.450.000

yaml
Salin kode

Optional:

- Small brand icon or initials
- Subtle divider between items

---

## Interaction Rules

- Items are NOT clickable
- No hover state required
- No inline actions (edit, delete, sell)

Only one CTA is allowed at section bottom:

Lihat semua holdings →

yaml
Salin kode

This CTA navigates to the full holdings page.

---

## Empty State

If the user has no holdings:

Title remains:
Holdings Terbaru

css
Salin kode

Body text:
Belum ada emas yang ditambahkan.
Tambahkan emas pertama Anda untuk mulai memantau portofolio.

makefile
Salin kode

CTA:
Tambah emas →

yaml
Salin kode

---

## Visual Style Guidelines

- Section should feel secondary
- Smaller typography than portfolio summary
- Neutral colors
- No green/red emphasis
- Avoid drawing attention away from main KPIs

---

## Non-Goals (Explicit)

Do NOT:

- Add valuation or PnL indicators here
- Duplicate portfolio or brand summary data
- Add charts or progress bars
- Add instructional or educational text

---

## Success Criteria

Implementation is correct if:

- Dashboard feels visually complete on desktop
- Section adds orientation without cognitive load
- User understands this is a preview, not analysis
- No new business logic is introduced

---

## Design Principle

Dashboard previews should answer:
"What do I own?"
not
"What should I do?"

Deliver a clean, production-ready implementation.
Do not over-engineer.
