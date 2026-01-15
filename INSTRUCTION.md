# PROMPT — Market Price Indicator (FINAL)

## Role & Goal

You are a senior frontend engineer implementing a **gold market price indicator** (ANTAM, Galeri 24).

The indicator must show:

- Current price
- Direction of movement
- Percentage change
- Clear temporal context

This task is **UI / UX logic only**.
Do NOT modify backend schema or scraper behavior.

---

## Core Principles (STRICT)

1. Market update time (`priceAt`) is the only source of truth
2. Scraping frequency must NOT affect price movement
3. Price movement is shown ONLY when the market updates
4. Never show misleading 0%
5. If information is ambiguous, show less — not more

---

## Available Data

Each price record provides:

- `price` (BigInt)
- `priceAt` (DateTime, market update timestamp)
- `recordedAt` (DateTime, ingestion time — IGNORE)
- `priceType` (SPOT / RETAIL / SELL / BUYBACK)

---

## Primary Price Display (Always Visible)

Format:
Rp <formatted_price>

makefile
Salin kode

Example:
Rp 2.918.000

yaml
Salin kode

---

## Comparison Rule (MANDATORY)

To compute movement:

- Compare the **latest record**
- With the **previous record where `price != latest.price`**
- Within the SAME `brandCode` and `priceType`

DO NOT:

- Compare per scrape
- Compare per hour
- Compare across price types
- Compare records with identical `priceAt`

---

## Movement Calculation

delta = latest.price - previousDifferent.price
percent = (delta / previousDifferent.price) * 100

yaml
Salin kode

Values are for display only and must NOT be persisted.

---

## Display Rules

### Case 1 — Market Price Increased

Condition:

- `latest.priceAt` > `previousDifferent.priceAt`
- `latest.price` > `previousDifferent.price`

Display:
↑ Rp 23.000 (+0.79%)

csharp
Salin kode

Helper text (required):
sejak update terakhir (09:12 WIB)

yaml
Salin kode

---

### Case 2 — Market Price Decreased

Condition:

- `latest.priceAt` > `previousDifferent.priceAt`
- `latest.price` < `previousDifferent.price`

Display:
↓ Rp 15.000 (-0.51%)

csharp
Salin kode

Helper text (required):
sejak update terakhir (09:12 WIB)

yaml
Salin kode

---

### Case 3 — Market Updated, Price Unchanged

Condition:

- `latest.priceAt` > `previousDifferent.priceAt`
- `latest.price == previousDifferent.price`

Display:
→ Rp 0 (0.00%)

csharp
Salin kode

Helper text (required):
harga tidak berubah sejak update terakhir (09:12 WIB)

yaml
Salin kode

This case ONLY applies if the SOURCE explicitly updated the market data.

---

### Case 4 — No Market Update (Duplicate Snapshot)

Condition:

- No new `priceAt`
- Scraper ran again with identical market timestamp

Display:

- Show price ONLY
- Do NOT show arrows, deltas, or percentages

Example:
Rp 2.918.000

csharp
Salin kode

Helper text (required):
menunggu update harga terbaru

yaml
Salin kode

---

### Case 5 — Weekend / Holiday / Market Closed

Condition:

- No new `priceAt` for a prolonged period (e.g. weekend or holiday)

Display:

- Same as Case 4

Helper text (required):
pasar belum memperbarui harga

yaml
Salin kode

---

## UX Rules (STRICT)

- Never show 0% caused by scraper frequency
- Never imply price stability if the market has not updated
- Directional indicators must reflect real market events
- Helper text is mandatory whenever movement is shown

---

## Non-Goals

- No price prediction
- No intraday charts
- No backend changes
- No financial advice

---

## Success Criteria

The implementation is correct if:

- Re-scraping does NOT change displayed movement
- Users never see misleading 0%
- Movement feels stable and trustworthy
- Indicator reflects real market behavior, not system behavior

---

## Final Instruction

Optimize for:

- User trust
- Financial correctness
- Long-term maintainability

Do not over-engineer.
Do not shortcut logic.
Ship production-ready UI behavior.
