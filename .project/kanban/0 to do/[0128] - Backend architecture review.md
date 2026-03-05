# [0128] Backend Architecture Review (Pass 1 — Structure & Contracts)

**Severity**: Medium
**Category**: Code Quality / Architecture
**Estimated Effort**: Medium

## Description

The frontend pillars were reviewed and cleaned up (tasks 0121–0127), but the backend (`src/applications/`) has never been audited. This task covers **Pass 1: Architecture & Structure**.

## Scope

Review all backend modules in `src/applications/modules/` for:

- [ ] Pillar boundary violations — any import from `frontend/` or direct use of `next/`
- [ ] Domain layer purity — `domain/` should have zero framework, HTTP, or DB imports
- [ ] Use case orchestration — business logic must live in `usecases/`, not in `delivery/http/`
- [ ] Controller patterns — all controllers must use `wrapController()` from `controller-wrapper.ts`
- [ ] Shared contracts usage — response/request types should reference `src/shared/contracts/`, not inline types
- [ ] Missing or misused error classes — check that controllers throw `ValidationError`, `NotFoundError`, etc. from `src/applications/shared/lib/errors.ts`
- [ ] Repository pattern consistency — Are all repos using interfaces? Is dependency injection consistent?
- [ ] Input validation — Are all user inputs validated at the controller level before reaching use cases?
- [ ] Rate limiting — Are public API endpoints rate-limited?
- [ ] Dead code — unused exports, unreachable branches, stale TODO comments

## Files to Review

```
src/applications/modules/*/v1/domain/
src/applications/modules/*/v1/usecases/
src/applications/modules/*/v1/delivery/http/
src/applications/shared/
```

## Acceptance Criteria

- All violations documented with file path + line number
- Each violation either fixed or a new task created for it
- No cross-pillar imports remain
