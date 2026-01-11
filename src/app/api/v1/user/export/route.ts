import { NextRequest, NextResponse } from 'next/server'
import { verifyUser } from '@/applications/shared/auth/auth.utils'
import { userService } from '@/applications/shared/auth/user.service'
import { logger } from '@/applications/shared/lib/logger'

/**
 * GET /api/v1/user/export
 * 
 * Exports all data for the authenticated user (UU PDP Right to Portability).
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await verifyUser(req)
    const data = await userService.exportUserData(userId)

    return NextResponse.json(data, {
      headers: {
        'Content-Disposition': `attachment; filename="emasku-data-${userId}.json"`,
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    logger.error('Failed to export data', { error })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
