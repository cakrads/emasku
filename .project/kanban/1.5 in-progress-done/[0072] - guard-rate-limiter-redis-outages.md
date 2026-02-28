# [0072] - Guard rate-limiter against Redis outages

**Source:** PR #4 CodeRabbit Review (Critical)

**Problem:**
The rate-limiter middleware doesn't swallow or manage connection failures. If Redis is unavailable, rate limiting throws and takes down the entire application path.

**Details:**
- File: `src/applications/shared/lib/rate-limiter.ts`

**Action Required:**
Add a guarded fallback to intercept caching provider errors, log them, and optionally allow the request to proceed (fail open) rather than 500'ing the stack.
