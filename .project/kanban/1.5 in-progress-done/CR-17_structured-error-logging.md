---
title: "Use structured error logging instead of console.log"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/lib/response.ts"
lines: "66-87"
status: backlog
created: 2026-02-28
---

# Use structured error logging instead of console.log

## Problem

`console.log('BaseError details:', error.details)` logs raw `error.details` to stdout in all environments. This may contain user input/PII and is not structured logging.

## Solution

Use the application's logger with environment-gated detail logging.

```diff
 import { NextResponse } from 'next/server'
 import { ZodError } from 'zod'
 import { BaseError } from './errors'
+import { logger } from './logger'

 if (error instanceof BaseError) {
-  console.log('BaseError details:', error.details)
+  logger.warn('BaseError', {
+    errorType: error.name,
+    traceId,
+    ...(process.env.NODE_ENV === 'development' ? { details: error.details } : {}),
+  })
   return NextResponse.json(
```

## Verification

- Build passes: `npm run build`
- In production → no `error.details` in logs
- In development → details are logged via structured logger
