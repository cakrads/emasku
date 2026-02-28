# [0059] - Primary recency sort price repository

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
Use `priceAt` as primary recency sort for latest market price selection. Currently orders by `recordedAt` primary over `priceAt`.

**Details:**
- File: `src/applications/modules/prices/v1/repository/prisma-price-repository.ts`

**Action Required:**
Change orderBy array in `getTodayPrices` to `priceAt: 'desc'` with `recordedAt: 'desc'` as a fallback tie-breaker.
