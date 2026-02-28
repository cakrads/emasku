# [0057] - Avoid per-holding price lookups

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
Avoid per-holding price lookups (N+1 query pattern). Code currently does per-holding price lookups inside the holdings.map.

**Details:**
- File: `src/applications/modules/portfolio/v1/usecases/get-portfolio-holdings.ts`

**Action Required:**
Instead of `await this.priceRepo.getLatestBuybackPrice(...)` inline in map, use a batch method via `getLatestBuybackPricesByPairs()`.
