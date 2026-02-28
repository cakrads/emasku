# [0058] - Validate sellDate sell holding

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
Validate `sellDate` before constructing persistence payload. Malformed string causes Invalid Date.

**Details:**
- File: `src/applications/modules/portfolio/v1/usecases/sell-holding.usecase.ts`

**Action Required:**
Add `isNaN(sellDate.getTime())` checks before building payload.
