# TASK: Enhance Portfolio Backend Implementation (Spec-Compliant & Future-Proof)

## Context

This project is **Emasku**, a gold portfolio tracking system.
The backend already has a solid Clean Architecture foundation, but:

- Portfolio usecases still rely on dummy data
- Repositories are stubbed
- Database schema exists but is not fully utilized

⚠️ IMPORTANT:
This task must strictly follow the **Emasku System Specification (FINAL)**.
Do NOT introduce entities or logic that contradict the spec.

---

## Core Principles (DO NOT VIOLATE)

1. **GoldPrice is immutable time-series**
2. **Brand is NOT an entity**
   - brandCode and brandName are string-based dimensions
3. **PortfolioHolding is user-owned factual data**
4. **All valuation logic lives in usecases**
5. **Frontend must never see Prisma models**
6. **Financial calculations must be precise and explicit**

---

## Step 1: Seed Data (REVISE EXISTING PLAN)

### ❌ DO NOT create or seed a Brand table

### ✅ Seed ONLY these models

- User
- PortfolioHolding
- GoldPrice

### Seed Requirements

#### GoldPrice

- brandCode: "ANTAM" (primary)
- brandName: "ANTAM"
- priceType:
  - SPOT (required)
  - SELL (optional)
  - BUYBACK (optional)
- denominationGram: 1
- priceAt: multiple historical timestamps (at least 7–14 days)
- price: realistic IDR values

> GoldPrice represents market facts, not user data.

#### PortfolioHolding

- One test user
- Multiple holdings:
  - Different buy dates
  - Different denominations
  - Some holdings using brandCode that may not have BUYBACK price
- Required fields:
  - brandCode
  - brandName
  - denominationGram
  - quantity
  - buyPrice
  - boughtAt

⚠️ Seed data must be deterministic and safe to re-run.

---

## Step 2: Repository Layer (STRICT RULES)

### Portfolio Repository

Implement:

- findAllByUserId(userId)
- findById(id)

Rules:

- NO valuation logic
- NO price logic
- ONLY data fetching and mapping
- Convert:
  - Decimal → number
  - BigInt → number

### Price Repository (Shared Helper)

Create:

- prisma-price-repository.ts

Methods:

- getLatestBuybackPrice(brandCode, denominationGram)
- getLatestSpotPrice(brandCode, denominationGram)

Rules:

- Return null if price does not exist
- NO assumptions about availability of BUYBACK

---

## Step 3: Usecase Layer (KEY ENHANCEMENTS)

### Portfolio Valuation Rules

For each holding:

1. Determine valuation price:
   - BUYBACK if available
   - else SPOT if available
   - else NULL (unvaluated holding)

2. Calculate:
   - totalBuyValue
   - currentValue (if valuation price exists)
   - unrealizedPnL
   - pnlPercentage

3. Explicitly expose:
   - valuationSource: "BUYBACK" | "SPOT" | "NONE"
   - priceAsOf timestamp

⚠️ Do NOT hardcode BUYBACK as mandatory.

---

### Update Usecases

#### get-portfolio-summary

- Fetch holdings from repository
- Fetch prices via price repository
- Aggregate by brandCode
- Return:
  - total grams
  - total buy value
  - total current value
  - total PnL
  - brand-level breakdown
- Include metadata:
  - priceAsOf
  - valuationCoverage (e.g. 80%)

#### get-portfolio-holdings

- Return list of individual holdings
- Each holding enriched with:
  - currentPrice (if any)
  - valuationSource
  - unrealizedPnL

#### get-holding-detail

- Return detailed valuation for a single holding
- Gracefully handle missing prices

#### get-portfolio-history (IMPORTANT REVISION)

- This is NOT a market price history
- It represents:
  - purchase timeline
  - buy value at purchase time
  - current value (optional)
- DO NOT derive time-series charts from holdings

---

## Step 4: Domain Model Separation (MANDATORY)

Separate domain concepts clearly:

- PortfolioHolding (raw, factual)
- ValuatedHolding (projection)
- PortfolioSummary (aggregation)

⚠️ Do NOT create “god objects” containing everything.

---

## Step 5: API Response Contract

Controllers must:

- Map domain → DTO
- Never expose Prisma types
- Always include:
  - currency: "IDR"
  - valuationSource
  - priceAsOf (if applicable)

Example:

```json
{
  "brandCode": "ANTAM",
  "totalGrams": 5,
  "currentValue": 12785000,
  "valuationSource": "BUYBACK",
  "priceAsOf": "2026-01-06T14:22:00Z"
}
```

Constraints

No authentication yet

Assume single user context

No pagination

No caching

No frontend changes in this task

Deliverables

Updated seed script

Implemented repositories

Updated usecases

Spec-compliant API responses

Manual verification steps

Focus on:
✔ correctness
✔ clarity
✔ future-proof design

Avoid:
✘ shortcuts
✘ over-engineering
✘ leaking infrastructure to domain
