# [0133] Frontend Bundle Size & Performance Audit

**Severity**: Low
**Category**: Performance
**Estimated Effort**: Small

## Description

After lazy loading was introduced (task 0122 session), verify that the bundle is actually optimized and identify any remaining heavy imports that should be code-split or deferred.

## Scope

### Bundle Analysis
- [ ] Run `npm run build` and inspect `.next/analyze/` (or add `@next/bundle-analyzer`)
- [ ] Identify any chunk > 200 KB that could be split
- [ ] Check if `decimal.js` is bundled correctly (should be in shared chunk, not duplicated)
- [ ] Check if `lucide-react` is tree-shaken (only icons actually used should be in bundle)

### Core Web Vitals
- [ ] Run Lighthouse audit on `/` (landing), `/login`, and `/dashboard`
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms targets
- [ ] Fix any image missing `width`/`height` causing CLS
- [ ] Check for render-blocking scripts

### Specific Items to Check
- [ ] `HeroBackground` parallax — confirm it uses `will-change: transform` correctly and doesn't repaint on every scroll
- [ ] `useScrollParallax` — verify it uses `requestAnimationFrame` or passive listeners, not synchronous scroll handlers
- [ ] Confirm `dynamic()` imports from lazy-loading PRs are actually code-split (check Network tab)

## Acceptance Criteria

- No individual JS chunk > 250 KB (gzipped)
- Lighthouse Performance score ≥ 80 on landing page
- All lazy-loaded components confirmed as separate chunks in Network tab
