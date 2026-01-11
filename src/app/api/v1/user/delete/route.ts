import { NextRequest, NextResponse } from 'next/server'
import { verifyUser } from '@/applications/shared/auth/auth.utils'
import { userService } from '@/applications/shared/auth/user.service'
import { createServerSupabaseClient } from '@/applications/shared/auth/supabase.server'
import { logger } from '@/applications/shared/lib/logger'

/**
 * DELETE /api/v1/user/delete
 * 
 * Deletes the authenticated user's data and signs them out.
 */
export async function DELETE(req: NextRequest) {
  try {
    const userId = await verifyUser(req)

    // 1. Delete from our database
    await userService.deleteUser(userId)

    // 2. Sign out from Supabase (Server-side)
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut({ scope: 'global' })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to delete user', { error })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
