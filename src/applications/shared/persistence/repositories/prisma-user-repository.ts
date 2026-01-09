/**
 * Prisma User Repository
 * 
 * Data access layer for User entity.
 */

import { prisma } from '../prisma-client'
import { logger } from '@/applications/shared/lib/logger'

export class PrismaUserRepository {
  /**
   * Find user ID by email.
   */
  async findByEmail(email: string): Promise<{ id: string } | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })

    if (!user) {
      logger.warn('User not found by email', { email })
      return null
    }

    return user
  }
}
