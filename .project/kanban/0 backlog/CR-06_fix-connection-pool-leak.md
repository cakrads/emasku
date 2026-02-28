---
title: "Fix connection pool leak on HMR reloads"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/persistence/prisma-client.ts"
lines: "7-8"
status: backlog
created: 2026-02-28
---

# Fix connection pool leak on HMR reloads

## Problem

The `pg.Pool` and `PrismaPg` adapter are created at module scope. On every HMR reload in development, new instances are instantiated even though `PrismaClient` is reused via the singleton pattern. This leaves abandoned `pg.Pool` instances with unclosed connections.

## Solution

Move pool and adapter into the singleton guard so they are only created once and tracked globally.

```diff
-const globalForPrisma = global as unknown as { prisma: PrismaClient }
+const globalForPrisma = global as unknown as {
+  prisma?: PrismaClient
+  pool?: pg.Pool
+  adapter?: PrismaPg
+}

-const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
-const adapter = new PrismaPg(pool)
+const pool = globalForPrisma.pool ?? new pg.Pool({ connectionString: process.env.DATABASE_URL })
+const adapter = globalForPrisma.adapter ?? new PrismaPg(pool)
+
+if (process.env.NODE_ENV !== 'production') {
+  globalForPrisma.pool = pool
+  globalForPrisma.adapter = adapter
+}
```

## Verification

- Build passes: `npm run build`
- In development, HMR reloads don't create new connection pools
- No "too many connections" errors during development
