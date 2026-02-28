# [0055] - Use typed 4xx error for missing userId

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
Use a typed 4xx error instead of generic `Error` for missing `userId`. Currently maps to a 500.

**Details:**
- File: `src/applications/modules/portfolio/v1/usecases/get-portfolio-history.ts`

**Action Required:**
Throw `ValidationError('userId is required')`.
