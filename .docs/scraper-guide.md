# Scraper Implementation Guide

## ✅ Status: Production Ready

The gold price scraper is fully operational and successfully ingesting live data from Galeri24.

---

## Components

### 1. Environment Constants (`src/applications/shared/lib/env.ts`)

Centralizes all environment variable access.

**Key Constants:**

- `SCRAPER_SOURCE_URL`: Source URL (default: <https://galeri24.co.id/harga-emas>)
- `DATABASE_URL`: PostgreSQL connection string
- `DIRECT_URL`: Direct connection for migrations/seeds

### 2. Nuxt Deserializer (`src/applications/shared/scrapers/nuxt-deserializer.ts`)

Resolves Nuxt.js `__NUXT_DATA__` reference-based serialization format.

**How it works:**

- The data is stored as an array where indices reference other values
- Example: `{ price: 6 }` means price value is at `data[6]`
- The deserializer recursively resolves all references to get actual values

### 3. Galeri24 Scraper (`src/applications/shared/scrapers/galeri24.scraper.ts`)

Production-grade scraper with three-phase architecture:

1. **Fetch**: `fetchSourceData()` - Retrieves HTML and extracts `__NUXT_DATA__`
2. **Parse**: `parsePrices()` - Deserializes and maps vendors to brands
3. **Persist**: `persistPrices()` - Saves to database with `skipDuplicates`

**Features:**

- ✅ Insert-only (idempotent)
- ✅ Defensive error handling
- ✅ Observable logging (logs to `.scrap/logs/`)
- ✅ Respects unique constraints
- ✅ Maps vendor names to brand codes (ANTAM, UBS, GALERI24)

**Data extracted:**

- 97 gold items per scrape
- 59 unique brand+denomination combinations
- Price types: SELL + BUYBACK
- Denominations: 0.001g to 1000g
- Price range: 15,000 IDR (0.001g) to 2.8B IDR (1kg)

### 4. Logger (`src/applications/shared/scrapers/scraper-logger.ts`)

Structured logging system that creates detailed execution logs in `.scrap/logs/`.
Logs include:

- Execution statistics (items extracted, records inserted/skipped)
- Full details of every inserted record (brand, price, timestamp)
- Errors and skipped brands

### 5. Standalone Runner (`src/applications/shared/scrapers/run-scraper.ts`)

Allows local execution for testing:

```bash
npm run scraper:run
```

### 6. API Route (`src/app/api/v1/scraper/run/route.ts`)

HTTP trigger for scraper (for cron jobs):

```bash
curl -X POST http://localhost:3000/api/v1/scraper/run
```

---

## Configuration

Add to your `.env` file:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
SCRAPER_SOURCE="https://galeri24.co.id/harga-emas"
```

---

## Database Schema

**Important:** The `GoldPrice.price` field uses `BigInt` to support large denomination prices (1kg bars cost 2.5B+ IDR).

---

## Usage

### Manual Execution

```bash
npm run scraper:run
```

Logs will be saved to `.scrap/logs/scraper-YYYY-MM-DDTHH-MM-SS.log`

### Via API

```bash
curl -X POST http://localhost:3000/api/v1/scraper/run
```

### Setup Cron Job (Vercel)

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/v1/scraper/run",
    "schedule": "0 */6 * * *"
  }]
}
```

---

## Design Principles

Following `instruction.md`:

- ✅ Insert-only behavior (no updates)
- ✅ Idempotent via `skipDuplicates`
- ✅ Preserves original timestamps
- ✅ Defensive error handling
- ✅ Observable logging
- ✅ Separation of concerns
- ✅ Production-ready

---

## Verification

Check scraped data in Prisma Studio:

```bash
npm run db:studio
```

Expected results:

- Brands: ANTAM, UBS, GALERI24
- Price types: SELL, BUYBACK
- Denominations: 0.001g to 1000g
- Prices: 15k to 2.8B IDR

---

## Troubleshooting

**Issue**: `__NUXT_DATA__ not found`

- Verify Galeri24 site is accessible
- Check if site structure changed

**Issue**: Brand not found

- Check logs for "Brands skipped" message
- Add missing brands to `prisma/data/brand.json`
- Run `npm run db:seed`

**Issue**: Duplicate key errors (shouldn't happen)

- Scraper uses `skipDuplicates` - check unique constraint
- Verify `brandId_priceType_denominationGram_priceAt` index exists
