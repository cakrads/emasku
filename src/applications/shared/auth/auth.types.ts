/**
 * Auth Types Module
 *
 * Re-exports from shared contracts to keep types in the neutral boundary.
 * Applications code should import from here; frontend code imports from
 * @/shared/contracts/auth.contract directly.
 */

export type {
  AuthStatus,
  AuthProvider,
  AuthUser,
  AuthSession,
  AuthErrorCode,
  AuthRecoveryAction,
  AuthError,
  AuthState,
  AuthResult,
} from '@/shared/contracts/auth.contract'
