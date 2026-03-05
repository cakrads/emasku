# [0131] Set up Vitest Unit Tests for Domain Layer

**Severity**: Medium
**Category**: Testing / Developer Experience
**Estimated Effort**: Large

## Description

No test runner is currently configured. Per CLAUDE.md, the chosen framework is **Vitest** with co-located `*.test.ts` files. This task sets up the infrastructure and writes the first meaningful tests.

## Scope

### Infrastructure
- [ ] Install `vitest`, `@vitest/coverage-v8` as devDependencies
- [ ] Add `vitest.config.ts` at repo root (or extend `vite.config.ts` if it exists)
- [ ] Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts to `package.json`
- [ ] Add `"test:coverage": "vitest run --coverage"` script

### Priority Test Targets (per CLAUDE.md)

1. **Domain entities** — Pure business rule validation
   - Gold weight calculation logic
   - PnL calculation correctness (use `decimal.js` in tests too)
   - Holding/goal state transitions

2. **Use case orchestration**
   - `createHolding` — valid input, duplicate detection, invalid weight
   - `sellHolding` — sells at correct price, partial sell logic
   - `recordConsent` — idempotent behavior

3. **Shared contract validators**
   - Schema validation for key contracts in `src/shared/contracts/`

### Test File Location
Co-locate next to source: `src/applications/modules/<feature>/v1/domain/*.test.ts`

## Acceptance Criteria

- `npm run test` passes with at least 10 meaningful tests
- Coverage report generated via `npm run test:coverage`
- No tests that mock the DB — use in-memory fakes or pure function tests
