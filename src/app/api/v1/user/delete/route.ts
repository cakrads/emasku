import { NextRequest, NextResponse } from 'next/server'
import { verifyUser } from '@/applications/shared/auth/auth.utils'
import { userService } from '@/applications/shared/auth/user.service'
import { createServerSupabaseClient } from '@/applications/shared/auth/supabase.server'
import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { successResponse } from '@/applications/shared/lib/response'

/**
 * DELETE /api/v1/user/delete
 * 
 * Deletes the authenticated user's data and signs them out.
 */
export const DELETE = wrapController(async (req: NextRequest) => {
  const userId = await verifyUser(req)

  // 1. Delete from our database
  await userService.deleteUser(userId)

  // 2. Sign out from Supabase (Server-side)
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut({ scope: 'global' })

  return successResponse({ success: true }, 'User deleted successfully')
})
