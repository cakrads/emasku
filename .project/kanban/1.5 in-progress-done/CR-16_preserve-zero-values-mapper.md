---
title: "Preserve zero values in portfolio mapper"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/modules/portfolio/v1/delivery/http/portfolio.mapper.ts"
lines: "54-83"
status: backlog
created: 2026-02-28
---

# Preserve zero values in portfolio mapper

## Problem

Truthy checks like `domain.currentPrice ? Math.round(...) : null` treat `0` as falsy, converting valid zero PnL/price values to `null`. This misrepresents zero values.

## Solution

Replace truthy checks with explicit `!== null` checks.

```diff
-currentBuybackPrice: domain.currentPrice ? Math.round(domain.currentPrice) : null,
+currentBuybackPrice: domain.currentPrice !== null ? Math.round(domain.currentPrice) : null,

-currentValue: domain.currentValue ? Math.round(domain.currentValue) : null,
+currentValue: domain.currentValue !== null ? Math.round(domain.currentValue) : null,

-unrealizedPnL: domain.unrealizedPnL ? Math.round(domain.unrealizedPnL) : null,
+unrealizedPnL: domain.unrealizedPnL !== null ? Math.round(domain.unrealizedPnL) : null,

-pnlPercentage: domain.pnlPercentage ? Number(domain.pnlPercentage.toFixed(2)) : null,
+pnlPercentage: domain.pnlPercentage !== null ? Number(domain.pnlPercentage.toFixed(2)) : null,

-sellPrice: domain.sellPrice ? Math.round(domain.sellPrice) : null,
+sellPrice: domain.sellPrice !== null ? Math.round(domain.sellPrice) : null,
```

## Verification

- Build passes: `npm run build`
- Holdings with zero PnL/price display `0` instead of `null`
- Holdings with actual null values still show `null`
