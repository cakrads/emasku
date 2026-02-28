---
title: "Add integer validation to sellPrice"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/persistence/repositories/prisma-portfolio-repository.ts"
lines: "126-145"
status: backlog
created: 2026-02-28
---

# Add integer validation to sellPrice

## Problem

`sellPrice` is validated only as `.positive()` but not as `.int()`, unlike `buyPrice` which has `.int().nonnegative()`. This allows decimal values (e.g., `123.45`) to reach the `BigInt()` conversions at lines 245 and 309, which will throw `RangeError`.

## Solution

Add `.int()` to `sellPrice` in both schemas in `src/shared/contracts/sell-holding.contract.ts`:

### In `SellHoldingRequestSchema` (line 14):
```diff
-sellPrice: z.number().positive(),
+sellPrice: z.number().int().positive(),
```

### In `BulkSellHoldingRequestSchema` (line 40):
```diff
-sellPrice: z.number().positive(),
+sellPrice: z.number().int().positive(),
```

## Verification

- Build passes: `npm run build`
- Sell request with decimal price (e.g., `123.45`) → rejected by validation
- Sell request with integer price → accepted normally
