# PRD: Fix Price Grouping Collisions

## Category: Minor
## Severity: Minor
## Target File: `src/applications/modules/prices/v1/delivery/http/prices-controller.ts`

## Problem
Prices are currently grouped by display name (`getBrandName(price.brand)`), which can lead to collisions if two different brand codes have the same display name.

## Solution
Change the grouping key to the unique `brandCode`:
1. Use `brandGroups` keyed by `price.brand`.
2. Include a `displayName` field in the response object for each group.

## Verification
- Mock two brands with different codes but the same name.
- Verify they appear as separate groups in the API response.
