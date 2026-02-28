# [0062] - Conditional exposure baseerror details

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
Do not expose raw `BaseError.details` unconditionally to clients in production environments.

**Details:**
- File: `src/applications/shared/lib/response.ts`

**Action Required:**
Only expose error.details if `process.env.NODE_ENV === 'development'`.
