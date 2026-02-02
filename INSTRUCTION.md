# FINAL SPEC — Gold Daily Close & PnL Computation

## Objective

Establish a **stable, deterministic, and explainable** mechanism to compute:

- Daily / Weekly / Monthly PnL
- Market up/down indicator (red/green)
- Portfolio valuation consistency

This system MUST NOT depend on intraday volatility or scraping timing differences.

---

## Core Principles

1. **Gold does not have an official market close**
2. **Daily Close is a SYSTEM DECISION**, not a market fact
3. **Analytics must be based on stable daily snapshots**
4. **Intraday prices are for latest valuation only**
5. **PnL comparisons are always CLOSE vs CLOSE**

---

## Definitions (Authoritative)

### GoldPrice

- Raw, immutable, intraday market observations
- Can be multiple per day
- NOT used directly for PnL comparison

### GoldDailyClose

- ONE authoritative price per brand + denomination + priceType per calendar day
- Represents:  
  **“Last known market price before day rollover”**
- Used for:
  - Daily change
  - Weekly change
  - Monthly change
  - Charts
  - Red / green indicators

---

## Daily Close Rule (FINAL)

For each `(brandCode, denominationGram, priceType)`:

1. Identify the **latest GoldPrice** with:
   - `priceAt < next_day_00:00`
2. If at least one exists:
   - That price becomes **Daily Close**
3. If NO GoldPrice exists for that calendar day:
   - **Carry forward previous Daily Close**
4. Persist result into `GoldDailyClose`

This rule applies to:

- Weekends
- Holidays
- Days without scraping activity

---

## Data Model (Required)

### GoldDailyClose

- brandCode
- brandName
- priceType (BUYBACK / SELL / SPOT)
- denominationGram
- price
- currency
- closeDate (DATE ONLY, no time)
- source = "SYSTEM_DAILY_CLOSE"
- derivedFromPriceAt (nullable)
- createdAt

Constraints:

- UNIQUE `(brandCode, priceType, denominationGram, closeDate)`

---

## Cron Job Responsibilities

### Schedule

- Runs once per day (recommended: 00:05 local time)

### Steps

1. For each active market combination:
   - Query latest GoldPrice `< today 00:00`
2. Apply Daily Close Rule
3. Insert or upsert GoldDailyClose
4. Log carry-forward events explicitly

---

## Portfolio Valuation Rules

### Cost Basis (All-Time)

cost_basis =
buyPrice * quantity

### Market Value (At Date D)

market_value =
daily_close_price(D) * total_grams

### All-Time PnL

PnL_all_time =
market_value(today_close) - cost_basis

---

## Periodic PnL Computation

### Daily PnL

daily_change =
today_close - yesterday_close

### Weekly PnL

weekly_change =
today_close - close_7_days_ago

### Monthly PnL

monthly_change =
today_close - close_30_days_ago

Notes:

- If missing date → use nearest previous available close
- Never use GoldPrice directly for comparisons

---

## UI Indicator Rules (RED / GREEN)

### Daily Indicator

- Compare:
today_close vs yesterday_close

- Green → market up
- Red → market down
- Neutral → no change

### All-Time Indicator

- Compare:
market_value vs cost_basis

- Independent from daily indicator

⚠️ A holding CAN be:

- Green all-time
- Red today

This is EXPECTED and CORRECT.

---

## Charting Rules

- Charts MUST use `GoldDailyClose`
- NO intraday GoldPrice in charts
- Weekends appear as flat lines (carry-forward)
- Charts represent **decision history**, not scraping noise

---

## Anti-Patterns (Explicitly Forbidden)

- ❌ Comparing GoldPrice directly across days
- ❌ Inferring close price dynamically on read
- ❌ Using “latest price” as daily change reference
- ❌ Leaving gaps on weekends
- ❌ Mixing cost basis with intraday movements

---

## System Guarantee

This architecture guarantees:

- Deterministic analytics
- Explainable numbers
- Stable charts
- Trustworthy red/green signals
- No user confusion from scraping time variance

---

## Status

This spec is **FINAL**.
Any deviation requires explicit architectural review.
