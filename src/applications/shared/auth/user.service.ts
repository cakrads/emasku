import { prisma } from '../persistence/prisma-client'
import { logger } from '@/applications/shared/lib/logger'

export class UserService {
  /**
   * Syncs a Supabase user with the local Prisma database.
   * If the user doesn't exist, it creates one.
   */
  async syncUser(params: { id: string, email: string, name?: string }) {
    try {
      const user = await prisma.user.upsert({
        where: { id: params.id },
        update: {
          email: params.email,
          name: params.name,
        },
        create: {
          id: params.id,
          email: params.email,
          name: params.name,
        },
      })
      return user
    } catch (error) {
      logger.error('Failed to sync user', { error, userId: params.id })
      throw error
    }
  }

  /**
   * Deletes a user and all related data (Right to Deletion).
   */
  async deleteUser(userId: string) {
    try {
      // cascade delete will handle holdings and consents (if configured in prisma)
      await prisma.user.delete({
        where: { id: userId }
      })
      logger.info('User deleted for UU PDP compliance', { userId })
    } catch (error) {
      logger.error('Failed to delete user', { error, userId })
      throw error
    }
  }

  /**
   * Exports all user data (Right to Portability/Access).
   */
  async exportUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        holdings: true,
        consents: true,
      }
    })

    if (!user) throw new Error('User not found')

    return {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        law: 'UU PDP No. 27/2022'
      },
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      holdings: user.holdings.map(h => ({
        brand: h.brandCode,
        name: h.brandName,
        weight: h.denominationGram,
        quantity: h.quantity,
        buyPrice: h.buyPrice.toString(),
        boughtAt: h.boughtAt,
        notes: h.notes
      })),
      consents: user.consents.map(c => ({
        purpose: c.purpose,
        status: c.isGranted ? 'granted' : 'withdrawn',
        version: c.version,
        recordedAt: c.createdAt
      }))
    }
  }
}

export const userService = new UserService()
