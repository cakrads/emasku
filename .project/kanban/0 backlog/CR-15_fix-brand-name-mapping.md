---
title: "Fix brandName mapping in price scraper"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/modules/prices/v1/usecases/scrape-and-persist-prices.ts"
lines: "37-61"
status: backlog
created: 2026-02-28
---

# Fix brandName mapping in price scraper

## Problem

Both SELL and BUYBACK price entries set `brandName` to `raw.brand` (the code, e.g., "ANTAM") instead of `raw.brandName` (the display name). This stores the brand code as the human-readable name.

## Solution

Use `raw.brandName` for the `brandName` field in both SELL and BUYBACK entries.

```diff
 if (raw.sellPrice) {
   pricesToSave.push({
     brandCode: raw.brand,
-    brandName: raw.brand,
+    brandName: raw.brandName,
     priceType: PriceType.SELL,
     denominationGram: raw.denominationGram,
     price: raw.sellPrice,
```

```diff
 if (raw.buybackPrice) {
   pricesToSave.push({
     brandCode: raw.brand,
-    brandName: raw.brand,
+    brandName: raw.brandName,
     priceType: PriceType.BUYBACK,
     denominationGram: raw.denominationGram,
     price: raw.buybackPrice,
```

## Verification

- Build passes: `npm run build`
- Run scraper → verify stored prices have correct human-readable brand names
- Check database: `brandCode` should be "ANTAM", `brandName` should be "Antam" (or similar)
