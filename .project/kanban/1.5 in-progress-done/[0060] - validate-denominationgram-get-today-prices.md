# [0060] - Validate denominationGram get today prices

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
Validate `denominationGram` before creating Decimal. Non-finite or non-positive values can throw bubbling 500.

**Details:**
- File: `src/applications/modules/prices/v1/usecases/get-today-prices.ts`

**Action Required:**
Ensure it is finite and > 0, throw ValidationError otherwise.
