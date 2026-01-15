# PROMPT — Market Today Card (FINAL, COPY-READY)

## ROLE

You are a **Senior Product Designer + UX Writer with strong financial domain understanding**.
Your task is to refine the **“Pasar Hari Ini / Market Today” card** so it is:

- Clear
- Non-misleading
- Consistent with portfolio valuation logic
- Easy to understand for non-technical users

This is for an **MVP gold investment tracking app**.

---

## CONTEXT (DO NOT CHANGE LOGIC)

- Market prices are scraped from official sources (Antam, Galeri 24).
- Data updates are **not real-time** and may remain unchanged for several hours.
- The card represents **market reference prices**, NOT portfolio value.
- Portfolio valuation uses **BUYBACK price**, while Market Today may show **SELL/SPOT price**.
- Price deltas represent **change compared to last market update**, not portfolio gain.

---

## OBJECTIVE

Improve **UX clarity and copywriting** of the Market Today card **without changing data or calculations**.

The card must:

1. Clearly state that it is a **market reference**
2. Clearly explain what the price change represents
3. Reduce ambiguity when price does not change for several hours
4. Avoid being confused with portfolio value

---

## REQUIRED UI ELEMENTS

### 1. Card Title

- Keep: **“Pasar Hari Ini”**
- Add a subtle context label under the title:
  - “Harga pasar acuan”
  OR
  - “Harga referensi pasar”

---

### 2. Price Display

- Show:
  - Brand name (e.g., Antam, Galeri 24)
  - Weight (e.g., 1g)
  - Current market price (unchanged)

Example:
