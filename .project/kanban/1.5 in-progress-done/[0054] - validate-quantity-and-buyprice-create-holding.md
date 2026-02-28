# [0054] - Validate quantity and buyPrice create holding

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
`quantity` and `buyPrice` are written without explicit guards. Invalid values (e.g., non-finite/negative) can corrupt portfolio data integrity.

**Details:**
- File: `src/applications/modules/portfolio/v1/usecases/create-holding.usecase.ts`

**Action Required:**
Ensure `Number.isFinite(request.quantity)` and `request.quantity > 0`. Ensure `Number.isFinite(request.buyPrice)` and `request.buyPrice >= 0`. Throw ValidationError if they fail.
