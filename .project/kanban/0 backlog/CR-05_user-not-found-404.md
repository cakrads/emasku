---
title: "Return 404 for missing users instead of 500"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/auth/user.service.ts"
lines: "50-59"
status: backlog
created: 2026-02-28
---

# Return 404 for missing users instead of 500

## Problem

`exportUserData` throws a plain `Error` when user is not found, which `errorResponse` maps to a generic 500. The API should correctly return 404.

## Solution

Use `NotFoundError` so the error handler returns the proper HTTP status code.

```diff
+import { NotFoundError } from '@/applications/shared/lib/errors'
 ...
- if (!user) throw new Error('User not found')
+ if (!user) {
+   throw new NotFoundError('User not found', { userId })
+ }
```

## Verification

- Build passes: `npm run build`
- API returns 404 when requesting data for a non-existent user
- API still returns user data normally for existing users
