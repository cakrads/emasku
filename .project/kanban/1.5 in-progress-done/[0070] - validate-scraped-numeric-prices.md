# [0070] - Validate scraped numeric prices

**Source:** PR #4 CodeRabbit Review (Critical)

**Problem:**
Truthiness checks on `raw.sellPrice` and `raw.buybackPrice` in the scraper usecase allow negative values or `NaN` to be persisted. This can silently corrupt all portfolio valuations.

**Details:**
- File: `src/applications/modules/prices/v1/usecases/scrape-and-persist-prices.ts`

**Action Required:**
Verify `Number.isFinite(value)` and `value > 0` before appending to `pricesToSave`.
