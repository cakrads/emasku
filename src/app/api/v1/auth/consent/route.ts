import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/applications/shared/auth/supabase.server'
import { userService } from '@/applications/shared/auth/user.service'
import { consentService } from '@/applications/shared/privacy/consent.service'
import { ConsentPurpose } from '@/applications/shared/privacy/privacy.types'
import { logger } from '@/applications/shared/lib/logger'
import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { UnauthorizedError, ValidationError } from '@/applications/shared/lib/errors'
import { successResponse } from '@/applications/shared/lib/response'

/**
 * POST /api/v1/auth/consent
 *
 * Records user consent for UU PDP compliance and syncs user to database.
 */
export const POST = wrapController(async (req: NextRequest) => {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new UnauthorizedError('Unauthorized')
  }

  // Sync user to our DB
  await userService.syncUser({
    id: user.id,
    email: user.email ?? null,
    name: user.user_metadata?.full_name || user.user_metadata?.name
  })

  const body = await req.json()
  const { purposes, version, isGranted } = body

  if (!Array.isArray(purposes) || !version) {
    throw new ValidationError('Invalid payload: purposes (array) and version are required')
  }

  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = req.headers.get('user-agent') || 'unknown'

  await Promise.all(
    purposes.map((purpose: ConsentPurpose) =>
      consentService.recordConsent(user.id, {
        purpose,
        isGranted: isGranted !== false, // default to true
        version,
        ipAddress: ip,
        userAgent: userAgent
      })
    )
  )

  logger.info('Consent recorded', { userId: user.id, purposes })

  return successResponse(null, 'Consent recorded successfully')
})
