# [0075] - Validate rawData is array before casting

**Source:** PR #4 CodeRabbit Review (Minor)

**Problem:**
`fetchSourceData()` returns `unknown`, but it is arbitrarily cast to `unknown[]` without validation. If the JSON payload isn't an array, `parsePrices` fails with a confusing error.

**Details:**
- Action Required: Ensure `Array.isArray(rawData)` before casting and processing.
