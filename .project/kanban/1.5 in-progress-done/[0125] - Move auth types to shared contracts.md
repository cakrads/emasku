# [0005] Move Auth Types to Shared Contracts

**Priority:** Low
**Effort:** Small (3 files + 1 new contract)
**Category:** Architecture

---

## Problem

3 frontend files import types (and runtime functions) from `@/applications/shared/auth`, violating pillar separation. `src/shared/contracts/auth.contract.ts` does not exist yet.

## Files to Change

| File | Current Import |
|------|---------------|
| `src/frontend/providers/auth-provider.tsx` | `import type { AuthSession }` from `@/applications/shared/auth` |
| `src/frontend/providers/auth.store.ts` | `import type { AuthUser, AuthSession, AuthStatus, AuthError }` from `@/applications/shared/auth` |
| `src/frontend/services/auth/auth.api.ts` | Runtime imports (`loginWithGoogle`, `signOut`, `getSession`, `onAuthStateChange`) + types from `@/applications/shared/auth` |

## Action

1. Create `src/shared/contracts/auth.contract.ts` with the shared types
2. Update type imports in `auth-provider.tsx` and `auth.store.ts` to use the contract
3. For `auth.api.ts`: the runtime function imports need a thin adapter or the auth service needs to expose a frontend-safe interface

## Acceptance Criteria

- [ ] `auth.contract.ts` exists in `src/shared/contracts/`
- [ ] No `import type` from `@/applications/` in frontend files
- [ ] Runtime function imports addressed (adapter or restructure)
- [ ] `npm run build` passes
