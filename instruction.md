You are a senior backend engineer building a production-grade gold price scraper.

Context:

- Project: Gold Portfolio Tracker
- Stack: Node.js + TypeScript
- Runtime: Serverless-compatible (Vercel Cron or Node)
- ORM: Prisma
- Database schema already exists and MUST be respected

Your task:
Build a robust scraper to ingest gold prices from Logam Mulia / Galeri24-like sources into the GoldPrice table.

========================================
CORE REQUIREMENTS (NON-NEGOTIABLE)
========================================

1. DATA SOURCE STRATEGY

- Prefer structured data over HTML scraping
- Inspect __NUXT_DATA__ or JSON payloads from network requests
- DO NOT rely on brittle DOM selectors unless unavoidable
- If JSON exists, parse JSON only

1. MARKET TRUTH MODEL

- Each record represents ONE immutable market truth
- Never overwrite existing GoldPrice rows
- Insert-only behavior
- Use Prisma `createMany({ skipDuplicates: true })`

1. TIME SEMANTICS (CRITICAL)

- priceAt = actual market timestamp from upstream data
- recordedAt = ingestion time (now)
- DO NOT normalize to midnight
- Preserve intraday timestamps if available

1. PRICE TYPES
Map upstream prices to PriceType enum correctly:

- Historical chart → SPOT
- Retail selling price → SELL
- Buyback price → BUYBACK

Never mix these.

1. BRAND HANDLING

- Resolve brand by stable code (e.g. "ANTAM")
- If brand does not exist, FAIL HARD (do not auto-create)
- Log explicit error

1. DENOMINATION HANDLING

- Normalize gram values to Decimal(10,3)
- Default to 1 gram if source implies per-gram pricing
- Never assume denomination without documenting it

========================================
SCRAPER BEHAVIOR
========================================

- Idempotent: Running scraper multiple times must not create duplicates
- Deterministic: Same input → same DB result
- Defensive: Missing or malformed data must be logged, not ignored
- Observable: Console logs must explain what happened

========================================
ERROR HANDLING
========================================

- Network failure → throw error
- Schema mismatch → throw error
- Missing required fields → skip row + log warning
- Partial success is acceptable but must be visible

========================================
OUTPUT EXPECTATION
========================================

Produce:

1. A single scraper function:
   scrapeAntamPrices(): Promise<void>

2. Clear separation:
   - fetchSourceData()
   - parsePrices()
   - persistPrices()

3. Prisma usage aligned with schema:
   GoldPrice {
     brandId
     priceType
     denominationGram
     price
     priceAt
     recordedAt
     source
     rawPayload
   }

4. Inline comments explaining:
   - why this approach is chosen
   - assumptions made from upstream data

========================================
DO NOT DO
========================================

- Do not hardcode dates
- Do not mutate existing price rows
- Do not store derived values
- Do not compute deltas or percentages
- Do not write frontend-oriented logic

========================================
BONUS (IF POSSIBLE)
========================================

- Allow scraper to be run locally (node script)
- Allow scraper to be triggered via API route
- Extract source adapter so future sources can be added cleanly

========================================
DELIVERABLE
========================================

Return:

- TypeScript code
- Clear function boundaries
- Ready to plug into:
  src/applications/shared/scrapers/

If assumptions are required, state them explicitly in comments.
