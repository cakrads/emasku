# [0061] - Do not allow hardcoded default public keys

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
Do not allow hardcoded default public keys when enforcement is enabled or missing env vars.

**Details:**
- File: `src/applications/shared/lib/public-api-key.ts`

**Action Required:**
Filter out empty env vars instead of having `_default` suffixes in VALID_KEYS.
