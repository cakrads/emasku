import { NextRequest, NextResponse } from 'next/server'
import { verifyUser } from '@/applications/shared/auth/auth.utils'
import { userService } from '@/applications/shared/auth/user.service'
import { wrapController } from '@/applications/shared/lib/controller-wrapper'

/**
 * GET /api/v1/user/export
 * 
 * Exports all data for the authenticated user (UU PDP Right to Portability).
 */
export const GET = wrapController(async (req: NextRequest) => {
  const userId = await verifyUser(req)
  const data = await userService.exportUserData(userId)

  return NextResponse.json(data, {
    headers: {
      'Content-Disposition': `attachment; filename="emasku-data-${userId}.json"`,
      'Content-Type': 'application/json'
    }
  })
})
