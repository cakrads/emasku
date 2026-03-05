# [0129] Backend Performance Review (Pass 2 — Queries & Data Flow)

**Severity**: Medium
**Category**: Performance
**Estimated Effort**: Medium

## Description

Pass 2 of the backend review. Focus on **database query efficiency and data flow patterns** that could cause N+1 queries, unnecessary data fetching, or slow response times.

## Scope

- [ ] **N+1 queries** — Prisma `findMany` calls that loop and call DB inside the loop
- [ ] **Missing `select`** — Queries fetching full rows when only a few fields are needed
- [ ] **Missing indexes** — Check `schema.prisma` for columns used in `where`/`orderBy` without `@@index`
- [ ] **Pagination** — Any endpoint returning unbounded lists (no `take`/`skip`)
- [ ] **BigInt/Decimal serialization** — Ensure prices (BigInt) and weights (Decimal) are correctly converted before JSON serialization (no `TypeError: Do not know how to serialize a BigInt`)
- [ ] **Duplicate queries per request** — Same data fetched multiple times in the same request lifecycle
- [ ] **Gold price fetch pattern** — Confirm `GoldPrice` latest-price lookup is not doing a table scan

## Files to Review

```
src/applications/shared/persistence/repositories/
src/applications/modules/*/v1/usecases/
src/applications/modules/*/v1/delivery/http/
prisma/schema.prisma
```

## Acceptance Criteria

- All N+1 patterns identified and fixed or ticketed
- Critical missing indexes added to `schema.prisma`
- No unbounded list endpoints without pagination
