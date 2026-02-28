# [0053] - Redact raw userId in logs

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
Avoid logging raw `userId` in routine info logs. Exposes user identifiers unnecessarily in normal operational logs.

**Details:**
- File: `src/applications/modules/portfolio/v1/usecases/create-holding.usecase.ts`

**Action Required:**
Remove the `userId` from the `logger.info` call metadata entirely or anonymize it.
