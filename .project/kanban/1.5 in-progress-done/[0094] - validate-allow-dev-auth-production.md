# [0094] Validate ALLOW_DEV_AUTH Not Enabled in Production

## Category
Security Hardening — 🟡 Minor

## Problem
`ALLOW_DEV_AUTH` is checked in `auth.utils.ts` but not validated in `validateEnv()`.
While a dual guard exists (`NODE_ENV === 'development'`), misconfiguration could
accidentally enable the dev auth bypass in staging or production.

## Fix
Add an explicit check in `env.ts`:

```ts
if (IS_PRODUCTION && process.env.ALLOW_DEV_AUTH === 'true') {
  throw new Error('ALLOW_DEV_AUTH must not be enabled in production')
}
```

## Files
- `src/applications/shared/lib/env.ts`
