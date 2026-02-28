import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from './supabase.server'
import { UnauthorizedError } from '@/applications/shared/lib/errors'
import { PrismaUserRepository } from '@/applications/shared/persistence/repositories/prisma-user-repository'
import { logger } from '@/applications/shared/lib/logger'

/**
 * Verify User Authentication
 * 
 * Resolves the authenticated User ID from the request using:
 * 1. Bearer Token (Authorization Header)
 * 2. Supabase Cookie Session
 * 3. Development Fallback (if configured)
 * 
 * Throws UnauthorizedError if no valid authentication found.
 */
export async function verifyUser(req: NextRequest): Promise<string> {
  const supabase = await createServerSupabaseClient()

  // 1. Bearer Token (API/Mobile Clients)
  const authHeader = req.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (user) return user.id
    if (error) throw new UnauthorizedError('Invalid Bearer token')
  }

  // 2. Cookie Session (Browser Clients)
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    return user.id
  }

  // 3. Development Fallback (Explicitly Allowed Development Only)
  if (process.env.NODE_ENV === 'development' && process.env.ALLOW_DEV_AUTH === 'true') {
    // We instantiate repo here to check for test user
    // Ideally this shouldn't be needed often as we use real auth now
    const userRepo = new PrismaUserRepository()
    const testUser = await userRepo.findByEmail('test@emasku.com')
    if (testUser) {
      logger.warn('Using development auth fallback', { userId: testUser.id })
      return testUser.id
    }
  }

  throw new UnauthorizedError('Authentication required')
}
