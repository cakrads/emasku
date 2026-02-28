---
title: "Fix circular reference detection in nuxt-deserializer"
severity: critical
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/scrapers/nuxt-deserializer.ts"
lines: "34-65"
status: done
created: 2026-02-28
---

# Fix circular reference detection in nuxt-deserializer

## Problem

The `resolveValue` function can recurse infinitely on circular numeric references (e.g., `data[i] === i`), causing a stack overflow crash. There is no cycle detection mechanism.

## Solution

Add a `Set<number>` parameter (`visited`) that tracks numeric indices already being resolved. Check and abort recursion when an index is already in the set.

```diff
-function resolveValue(data: unknown[], value: unknown): unknown {
+function resolveValue(data: unknown[], value: unknown, visited: Set<number> = new Set()): unknown {
   if (typeof value === 'number' && value >= 0 && value < data.length) {
+    if (visited.has(value)) {
+      console.warn(`[Deserializer] Circular reference detected at index ${value}`)
+      return undefined
+    }
+    visited.add(value)
     const resolved = data[value]
     if (typeof resolved === 'number') {
-      return resolveValue(data, resolved)
+      return resolveValue(data, resolved, visited)
     }
     if (typeof resolved === 'object' && resolved !== null && !Array.isArray(resolved)) {
       const resolvedObj: Record<string, unknown> = {}
       for (const [key, val] of Object.entries(resolved)) {
-        resolvedObj[key] = resolveValue(data, val)
+        resolvedObj[key] = resolveValue(data, val, new Set(visited))
       }
       return resolvedObj
     }
     return resolved
   }
   if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
     const resolvedObj: Record<string, unknown> = {}
     for (const [key, val] of Object.entries(value)) {
-      resolvedObj[key] = resolveValue(data, val)
+      resolvedObj[key] = resolveValue(data, val, visited)
     }
     return resolvedObj
   }
   return value
 }
```

## Verification

- Build passes: `npm run build`
- No runtime errors with circular reference test data
- Test with self-referential data: `data[5] = 5`
