import { prisma } from '../persistence/prisma-client'
import { ConsentPurpose, ConsentRecord } from './privacy.types'

/**
 * ConsentService handles user consent records for UU PDP compliance.
 * It provides methods to record, fetch, and verify user consents.
 */
export class ConsentService {
  /**
   * Records a user's consent action (grant or withdraw).
   */
  async recordConsent(userId: string, record: ConsentRecord): Promise<void> {
    await prisma.consent.create({
      data: {
        userId,
        purpose: record.purpose,
        isGranted: record.isGranted,
        version: record.version,
        ipAddress: record.ipAddress,
        userAgent: record.userAgent,
      },
    })
  }

  /**
   * Gets the current consent status for all purposes for a user.
   */
  async getConsentStatus(userId: string) {
    // Get the latest record for each purpose
    const consents = await prisma.consent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    // Group by purpose and take the first (latest) one
    const latestConsents: Record<string, boolean> = {}
    consents.forEach((c) => {
      if (!(c.purpose in latestConsents)) {
        latestConsents[c.purpose] = c.isGranted
      }
    })

    return latestConsents
  }

  /**
   * Verifies if a user has granted consent for a specific purpose.
   */
  async hasConsent(userId: string, purpose: ConsentPurpose): Promise<boolean> {
    const latest = await prisma.consent.findFirst({
      where: { userId, purpose },
      orderBy: { createdAt: 'desc' },
    })

    return latest?.isGranted ?? false
  }

  /**
   * Records initial mandatory consents for a new user.
   */
  async recordInitialConsents(userId: string, metadata: { ip?: string, userAgent?: string, version: string }): Promise<void> {
    const mandatoryPurposes: ConsentPurpose[] = [
      'ACCOUNT_CREATION',
      'PORTFOLIO_ANALYTICS',
    ]

    await Promise.all(
      mandatoryPurposes.map((purpose) =>
        this.recordConsent(userId, {
          purpose,
          isGranted: true,
          version: metadata.version,
          ipAddress: metadata.ip,
          userAgent: metadata.userAgent,
        })
      )
    )
  }
}

// Export a singleton instance
export const consentService = new ConsentService()
