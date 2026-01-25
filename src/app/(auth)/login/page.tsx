import { Suspense } from 'react'
import { LoginView } from '@/frontend/features/public/login/login-view'

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-background to-accent-gold/5">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginView />
    </Suspense>
  )
}
