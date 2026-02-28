# [0082] - Preserve formatting for result keys in price repo

**Source:** PR #4 CodeRabbit Review (Minor)

**Problem:**
Line 139 rebuilding keys uses `Number(record.denominationGram)` which can alter the format (e.g. "1.000" to "1"), breaking downstream lookups.

**Details:**
- File: `src/applications/shared/persistence/repositories/prisma-price-repository.ts`
- Action Required: Use the original input keys or avoid coercing to `Number` to ensure deterministic string matching when retrieved by callers.
