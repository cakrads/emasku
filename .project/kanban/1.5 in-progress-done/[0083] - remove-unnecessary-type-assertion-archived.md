# [0083] - Remove unnecessary type assertion for ARCHIVED

**Source:** PR #4 CodeRabbit Review (Minor)

**Problem:**
Line 378's `as any` type assertion is redundant since `ARCHIVED` is a valid `HoldingStatus` item.

**Details:**
- File: `src/applications/shared/persistence/repositories/prisma-portfolio-repository.ts`
- Action Required: Pass `HoldingStatus.ARCHIVED` without casting it.
