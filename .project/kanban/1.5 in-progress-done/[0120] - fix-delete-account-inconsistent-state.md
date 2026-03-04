# Fix Delete Account Inconsistent State on Logout Failure

**Source:** CodeRabbit FE Review #3 — Issue #8
**Severity:** LOW-MEDIUM
**Type:** Bug Fix (edge case)

## Problem

`src/frontend/features/admin/profile/profile-view.tsx` — `handleDeleteAccount`:

If `logout()` throws after `deleteUser()` succeeds, the user is left on the profile page with `isDeleting = false` and their account already deleted but client still considers them "logged in".

## Fix

```tsx
const handleDeleteAccount = async () => {
  setIsDeleting(true)
  try {
    await deleteUser()
    toast.success(t('profile.messages.deleteSuccess'))
    await logout().catch(() => {})
    router.push(ROUTES.LOGIN)
  } catch (err) {
    console.error(err)
    toast.error(t('profile.messages.deleteError'))
  } finally {
    setIsDeleting(false)
  }
}
```

Key changes:
- `logout()` failure is caught silently so redirect still happens
- `finally` block always resets `isDeleting`

## Files

- `src/frontend/features/admin/profile/profile-view.tsx`
