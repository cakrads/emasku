# 🧠 Gold Price Scraper — Core Engineering Instructions

## Context (Read Carefully)

We are building a **financial-grade gold price tracking system**.

This system ingests **market price observations**, not mutable business records. A scraped price represents **one immutable market truth at a specific moment in time**.

The database schema has already been validated with the following guarantees:

* Prices are **time-series facts**
* Prices are **immutable**
* Multiple prices per day are **valid and expected**
* Price meaning is explicitly modeled via `PriceType`

---

## Current Architecture

* Next.js App Router (Vercel)
* Prisma v7 (prisma-config)
* Modular backend design:

  * `delivery/` → HTTP & transport logic
  * `usecase/` → orchestration & application rules
  * `domain/` → invariants & business rules
* Scraper executed via **cron-triggered API endpoint**
* Data sources:

  * Initial historical data → `SPOT`
  * Ongoing scraping → `SPOT`, `SELL`, `BUYBACK`

---

## 🎯 Goal

⚠️ **Critical clarification (previously implicit, now explicit):**

Derived `SPOT` prices **MUST be inserted into the database**, not just computed in memory.

Whenever a `SELL` price is ingested from upstream sources, the system MUST **atomically persist**:

* one `SELL` record (market truth)
* one derived `SPOT` record (reference truth)

Both records MUST share the same `priceAt` and be written in the same transaction.

Build a **robust, idempotent, immutable scraper ingestion pipeline** that:

1. Scrapes gold prices from upstream sources
2. Persists them **without overwriting history**
3. Preserves market-truth semantics
4. Supports intraday updates (2–3 runs per day)
5. Is safe to retry and re-run

---

## 🚨 Critical Pressure Points (Non‑Negotiable)

### 1️⃣ Immutability Rule

* **NEVER UPDATE existing `GoldPrice` rows**
* **ALWAYS INSERT new rows**

Rationale:

* Market prices change intraday
* Updating destroys historical truth
* Charts and analytics depend on raw, untouched data

> One scrape = one snapshot of reality

---

### 2️⃣ Correct Price Semantics

Each scrape may emit **multiple price records** for the same brand and weight:

* `SPOT`
* `SELL`
* `BUYBACK`

These are:

* NOT interchangeable
* NOT overrides
* NOT duplicates

They represent **distinct market facts**.

---

### 3️⃣ Timestamp Discipline

* `priceAt` → **market timestamp**

  * Use upstream timestamp if available
  * Otherwise use scrape execution time (UTC)
* `recordedAt` → ingestion timestamp (automatic)

Rules:

* `priceAt` participates in uniqueness
* `recordedAt` is observability only

---

### 4️⃣ Idempotency Strategy

The scraper may run:

* Multiple times per day
* Via cron retries
* Manually by developers

Expected behavior:

* Same price + same timestamp → unique conflict → **skip**
* Same price + different timestamp → **insert**

Implementation requirements:

* Use Prisma `@@unique(...)`
* Catch unique constraint violations
* Gracefully continue execution

---

### 5️⃣ Centralized Error Handling

Do NOT:

* Throw raw scraper errors directly
* Leak parsing failures to HTTP responses

Must:

* Wrap errors in domain-safe error objects
* Log raw payloads for forensic debugging
* Return structured, predictable API responses

---

## 🧩 Required Structure (Mandatory)

### Scraper Flow

```
HTTP (cron endpoint)
  → Usecase (scrapeAndPersistPrices)
    → Scraper Adapter (fetch & parse)
      → Domain Validation
        → Repository Insert (Prisma)
```

---

### Module Responsibilities

#### `scrapers/`

* Fetch upstream data
* Parse raw payloads
* Normalize into DTOs
* **NO database logic**

#### `usecase/`

* Orchestrate scraping flow

* Assign `PriceType`

* Assign `priceAt`

* **Persist both SELL and derived SPOT records**

* Ensure SELL → SPOT derivation happens **before transaction commit**

* Handle idempotency

* Call persistence layer

* Orchestrate scraping flow

* Assign `PriceType`

* Assign `priceAt`

* Handle idempotency

* Call persistence layer

#### `domain/`

* Enforce invariants:

  * `price > 0`
  * `denominationGram > 0`
  * valid `PriceType`
* Pure logic only (no IO)

#### `delivery/`

* HTTP only
* Cron authentication / validation
* Response wrapping

---

## 📦 Persistence Rules

When inserting `GoldPrice` records:

* Always INSERT
* Never UPDATE
* On unique conflict:

  * Ignore
  * Log duplicate
  * Continue processing

---

## 📊 Chart Compatibility

Do NOT:

* Aggregate during insert
* Collapse data per day

Charts will:

* Query raw time-series data
* Aggregate at read time
* Use strategies like:

  * latest per day
  * latest overall

---

## ✅ Definition of Done

The implementation is correct when:

* Scraper can run multiple times per day
* No existing price records are updated
* Duplicate timestamps are handled gracefully
* `SPOT` and `SELL` prices coexist correctly
* Errors are centralized and structured
* Raw payloads are stored for traceability

---

## 🧠 Core Mental Model

> Storage records facts
> Use cases create meaning
> APIs present projections

Violating this principle means the implementation is incorrect.

---

## 🔚 Final Instruction

Implement the scraper and ingestion pipeline **strictly following this document**.

If trade-offs are required:

* Prefer correctness over convenience
* Prefer immutability over simplicity
* Prefer auditability over optimization
