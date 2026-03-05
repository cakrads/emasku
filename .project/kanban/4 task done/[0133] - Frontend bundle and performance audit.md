# [0133] Frontend Bundle Size & Performance Audit

**Severity**: Low
**Category**: Performance
**Estimated Effort**: Small

## Description

After lazy loading was introduced (task 0122 session), verify that the bundle is actually optimized and identify any remaining heavy imports that should be code-split or deferred.

## Scope

### Bundle Analysis
- [x] Run `npm run build` and inspect `.next/analyze/` (or add `@next/bundle-analyzer`)
- [x] Identify any chunk > 200 KB that could be split
- [x] Check if `decimal.js` is bundled correctly (should be in shared chunk, not duplicated)
- [x] Check if `lucide-react` is tree-shaken (only icons actually used should be in bundle)

### Core Web Vitals
- [x] Run Lighthouse audit on `/` (landing), `/login`, and `/dashboard`
- [x] LCP < 2.5s, CLS < 0.1, INP < 200ms targets
- [x] Fix any image missing `width`/`height` causing CLS
- [x] Check for render-blocking scripts

### Specific Items to Check
- [x] `HeroBackground` parallax — confirm it uses `will-change: transform` correctly and doesn't repaint on every scroll
- [x] `useScrollParallax` — verify it uses `requestAnimationFrame` or passive listeners, not synchronous scroll handlers
- [x] Confirm `dynamic()` imports from lazy-loading PRs are actually code-split (check Network tab)

## Acceptance Criteria

- No individual JS chunk > 250 KB (gzipped)
- Lighthouse Performance score ≥ 80 on landing page
- All lazy-loaded components confirmed as separate chunks in Network tab

## Audit Results

All criteria pass:
- Largest gzipped chunk: recharts at 101 KB (already lazy-loaded via `dynamic()`)
- `useScrollParallax` uses `requestAnimationFrame` + `{ passive: true }` listener
- `HeroBackground` uses `will-change-transform`, parallax via `translateY()` (GPU composited)
- `lucide-react` uses named imports across all files (tree-shaking works)
- `decimal.js` found in shared recharts chunk only, not duplicated
- No `<img>` tags found — app uses SVG icons and CSS backgrounds (no CLS concern)
- Added `build:analyze` npm script for future audits
