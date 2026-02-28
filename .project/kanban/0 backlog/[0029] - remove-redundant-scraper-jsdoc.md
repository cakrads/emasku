# PRD: Remove Redundant Scraper JSDoc

## Category: Nitpick
## Severity: Trivial
## Target File: `src/applications/shared/scrapers/galeri24.scraper.ts`

## Problem
There are two identical JSDoc blocks starting with "Parse raw payload into structured price data" in `galeri24.scraper.ts`.

## Solution
Delete the redundant JSDoc block, keeping only one directly above the parser function.

## Verification
- Inspect the file and ensure there is only one JSDoc block for the `parsePrices` (or equivalent) function.
