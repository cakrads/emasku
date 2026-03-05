# [0132] Set up GitHub Actions CI Pipeline

**Severity**: Medium
**Category**: DevOps / Developer Experience
**Estimated Effort**: Small

## Description

No CI pipeline exists. Every push/PR should automatically run lint, type-check, and (once 0131 is done) tests to prevent regressions from reaching `master`.

## Scope

Create `.github/workflows/ci.yml` that runs on every push to `develop` and every PR targeting `master`:

### Pipeline Steps

1. **Checkout** — `actions/checkout@v4`
2. **Setup Node** — `actions/setup-node@v4` with Node version from `.nvmrc` or `package.json#engines`
3. **Install deps** — `npm ci`
4. **Type check** — `npx tsc --noEmit`
5. **Lint** — `npm run lint`
6. **Tests** — `npm run test` *(add after 0131 is complete; skip with comment until then)*
7. **Build** — `npm run build` *(validates no build-breaking errors)*

### Optional (Nice to Have)

- [ ] Cache `node_modules` with `actions/cache` for faster runs
- [ ] Post lint/type errors as PR annotations using `--format=json` output

## Files to Create

```
.github/workflows/ci.yml
```

## Acceptance Criteria

- CI runs automatically on PR to `master`
- Lint and type-check failures block merge
- Build failure blocks merge
- Pipeline completes in under 5 minutes on a cold run
