# PRD: Hoist date-fns-tz Import

## Category: Performance
## Severity: Major
## Target File: `src/applications/shared/scrapers/galeri24.scraper.ts`

## Problem
The scraper uses `await import('date-fns-tz')` inside a loop for each price item. This creates unnecessary overhead and multiple lookups for the module cache on every iteration.

## Solution
Hoist the dynamic import outside the loop or use a standard static import at the top of the file.

## Verification
- Run a benchmark of the scraper with a large number of items.
- Verify improved execution time and reduced memory/CPU spikes.
