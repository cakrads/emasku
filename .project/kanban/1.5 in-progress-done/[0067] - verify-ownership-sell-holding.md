# [0067] - Verify holding ownership on sell holding

**Source:** PR #4 CodeRabbit Review (Critical)

**Problem:**
`SellHoldingUsecase` lacks user ownership verification. It checks existence by `holdingId` but fails to compare `holding.userId` with the executing `userId`.

**Details:**
- File: `src/applications/modules/portfolio/v1/usecases/sell-holding.usecase.ts`

**Action Required:**
Change `if (!holding || holding.id !== holdingId)` to `if (!holding || holding.userId !== userId)` to ensure users can only sell own holdings.
