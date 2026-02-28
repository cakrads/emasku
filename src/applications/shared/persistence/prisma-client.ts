import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient
  pool?: pg.Pool
  adapter?: PrismaPg
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is missing or empty. Please check your environment variables.')
}

const pool = globalForPrisma.pool ?? new pg.Pool({ connectionString })
const adapter = globalForPrisma.adapter ?? new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'production' ? [] : ['query'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.pool = pool
  globalForPrisma.adapter = adapter
}

