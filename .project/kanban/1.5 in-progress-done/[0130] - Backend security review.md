# [0130] Backend Security Review (Pass 3 — Auth & Input Validation)

**Severity**: High
**Category**: Security
**Estimated Effort**: Medium

## Description

Pass 3 of the backend review. Focus on **authentication enforcement, authorization gaps, and input validation** across all API routes.

## Scope

- [ ] **Route protection** — Every `/api/v1/` route that requires login must verify the session via middleware or explicit auth check in the controller
- [ ] **User scoping** — Queries for holdings, goals, transactions must always filter by `userId` from the session — never trust a `userId` from the request body or query params
- [ ] **Input validation** — All controller request parsers must validate: required fields, types, length limits, numeric ranges (e.g., quantity > 0, price > 0)
- [ ] **Admin-only routes** — Confirm admin-only endpoints (price seeding, user management) are protected by role check, not just authentication
- [ ] **Prisma injection safety** — Dynamic `where` clauses must not accept raw user strings without sanitization
- [ ] **Error message leakage** — `InternalError` responses must not expose stack traces or DB schema details to clients
- [ ] **CORS config** — Check `next.config.ts` or middleware for allowed origins

## Files to Review

```
src/middleware.ts
src/app/api/v1/**/route.ts
src/applications/modules/*/v1/delivery/http/
src/applications/shared/lib/errors.ts
src/applications/shared/auth/
```

## Acceptance Criteria

- Every authenticated endpoint verified to enforce session check
- All user-scoped queries confirmed to use session `userId`, not request param
- Input validation present on all mutating endpoints (POST, PATCH, DELETE)
