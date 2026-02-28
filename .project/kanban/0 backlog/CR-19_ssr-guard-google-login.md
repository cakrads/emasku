---
title: "Add SSR guard for loginWithGoogle"
severity: major
source: "CodeRabbit PR #4"
source_url: "https://github.com/cakrads/emasku/pull/4#pullrequestreview-3836310403"
target_file: "src/applications/shared/auth/auth.service.ts"
lines: "68-96"
status: backlog
created: 2026-02-28
---

# Add SSR guard for loginWithGoogle

## Problem

`loginWithGoogle` accesses `window.location.origin` at line 71, which throws a `ReferenceError` in Node.js/SSR contexts. This is a browser-only function but has no guard.

## Solution

Add a `typeof window` check before accessing browser APIs.

```diff
 export async function loginWithGoogle(): Promise<AuthResult<{ url: string }>> {
   try {
+    if (typeof window === 'undefined') {
+      return {
+        success: false,
+        error: mapSupabaseError(new Error('loginWithGoogle can only be called in browser context'))
+      }
+    }
+
     const supabase = getBrowserSupabaseClient()
     const redirectTo = `${window.location.origin}/auth/callback`
```

## Verification

- Build passes: `npm run build`
- Function works normally in browser
- No SSR crash when module is imported server-side
