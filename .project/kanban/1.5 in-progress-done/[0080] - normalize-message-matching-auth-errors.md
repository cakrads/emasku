# [0080] - Normalize message matching in auth.errors

**Source:** PR #4 CodeRabbit Review (Minor)

**Problem:**
The string matching for error classification in Supabase throws `AUTH_UNKNOWN` loosely because `includes(...)` checks are case-sensitive.

**Details:**
- File: `src/applications/shared/auth/auth.errors.ts`
- Action Required: Use `.toLowerCase()` on the message before substring matching, e.g., checking for `invalid login credentials`.
