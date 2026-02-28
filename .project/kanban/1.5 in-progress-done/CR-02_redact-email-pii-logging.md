---
title: "Redact email PII from log output"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/persistence/repositories/prisma-user-repository.ts"
lines: "20-22"
status: backlog
created: 2026-02-28
---

# Redact email PII from log output

## Problem

`logger.warn('User not found by email', { email })` logs the raw email address, violating privacy/compliance rules and leaking PII identifiers.

## Solution

Remove the email from the log payload or log a redacted/hashed value instead.

```diff
 if (!user) {
-  logger.warn('User not found by email', { email })
+  logger.warn('User not found by email')
   return null
 }
```

## Verification

- Build passes: `npm run build`
- Search codebase for any remaining raw email logging
- Verify log output no longer contains email addresses
