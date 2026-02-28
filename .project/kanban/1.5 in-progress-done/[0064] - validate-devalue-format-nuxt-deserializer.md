# [0064] - Validate devalue format nuxt deserializer

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
Deserializer cannot reliably distinguish numeric literals from reference indices. Need to validate input data first as Devalue format.

**Details:**
- File: `src/applications/shared/scrapers/nuxt-deserializer.ts`

**Action Required:**
Add type guard function `isDevalueFormat` to verify metadata structure before trusting numeric properties as cyclic index references.
