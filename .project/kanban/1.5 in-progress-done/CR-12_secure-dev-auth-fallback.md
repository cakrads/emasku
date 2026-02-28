---
title: "Secure dev auth fallback with explicit flag"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/auth/auth.utils.ts"
lines: "36-44"
status: backlog
created: 2026-02-28
---

# Secure dev auth fallback with explicit flag

## Problem

If `NODE_ENV` is accidentally unset or set to something other than `'production'`, requests without valid auth will be authenticated as the test user. The check `process.env.NODE_ENV !== 'production'` is too broad.

## Solution

Require an explicit environment flag (`ALLOW_DEV_AUTH`) in addition to `NODE_ENV === 'development'`, and log when the fallback is used.

```diff
-if (process.env.NODE_ENV !== 'production') {
+if (process.env.NODE_ENV === 'development' && process.env.ALLOW_DEV_AUTH === 'true') {
   const userRepo = new PrismaUserRepository()
   const testUser = await userRepo.findByEmail('test@emasku.com')
   if (testUser) {
+    logger.warn('Using development auth fallback', { userId: testUser.id })
     return testUser.id
   }
 }
```

## Verification

- Build passes: `npm run build`
- Without `ALLOW_DEV_AUTH=true` → dev fallback is not used
- With `ALLOW_DEV_AUTH=true` + `NODE_ENV=development` → fallback works with warning log
- In production → fallback is never triggered
