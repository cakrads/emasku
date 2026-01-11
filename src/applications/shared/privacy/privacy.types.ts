import { ConsentPurpose } from '@prisma/client'

export interface ConsentRecord {
  purpose: ConsentPurpose
  isGranted: boolean
  version: string
  ipAddress?: string
  userAgent?: string
}

export interface ConsentRecordWithMeta extends ConsentRecord {
  id: string
  userId: string
  createdAt: Date
}

export { ConsentPurpose }
