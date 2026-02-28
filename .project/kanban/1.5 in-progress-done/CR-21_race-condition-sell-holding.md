---
title: "Fix race condition in sell holding"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/persistence/repositories/prisma-portfolio-repository.ts"
lines: "229-259"
status: backlog
created: 2026-02-28
---

# Fix race condition in sell holding

## Problem

Two concurrent `sellHolding` calls can both read `status = ACTIVE`, both create separate SELL transactions, and the second update overwrites `soldTransactionId`. The `@unique` constraint on `soldTransactionId` doesn't prevent this since each transaction has a distinct ID.

## Solution

Add a `status: 'ACTIVE'` condition to the update `where` clause so only the first caller succeeds.

```diff
-await tx.portfolioHolding.update({
-  where: { id },
-  data: {
-    status: 'SOLD',
-    soldAt: data.sellDate,
-    soldTransactionId: transaction.id,
-  },
-})
+const updated = await tx.portfolioHolding.updateMany({
+  where: { id, userId, status: 'ACTIVE' },
+  data: {
+    status: 'SOLD',
+    soldAt: data.sellDate,
+    soldTransactionId: transaction.id,
+  },
+})
+if (updated.count !== 1) {
+  throw new Error('HOLDING_NOT_ACTIVE')
+}
```

## Verification

- Build passes: `npm run build`
- Concurrent sell requests for same holding → only first succeeds, second gets error
- Normal sell flow still works
