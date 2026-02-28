# PRD: Validate Denomination in Deserializer

## Category: Nitpick
## Severity: Minor
## Target File: `src/applications/shared/scrapers/nuxt-deserializer.ts`

## Problem
The deserializer defaults `denomination` to 0, which violates the `GoldPriceItemSchema` (which requires a positive number).

## Solution
1. Replace the `|| 0` default with `undefined` or `null`.
2. Skip processing items where `parseFloat` results in NaN or a non-positive value.
3. Ensure only valid items are pushed to the results.

## Verification
- Pass an item with `denomination: 0` to the deserializer.
- Verify it is either skipped or results in a valid schema failure instead of being silently converted to an invalid positive schema match.
