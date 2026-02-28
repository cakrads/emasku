# PRD: Standardize Cycle Detection in Nuxt Deserializer

## Category: Minor
## Severity: Minor
## Target File: `src/applications/shared/scrapers/nuxt-deserializer.ts`
## Lines: 51-69

## Problem
Inconsistent `visited` set handling across data branches causes unreliable cycle detection.

## Solution
1. Standardize how the `visited` set is passed and maintained across recursive calls.
2. Ensure each branch gets a consistent copy of the visited set.

## Verification
- Deserialize data with circular references.
- Verify cycle detection works consistently in all branches.
