
import 'dotenv/config'
import { PrismaUserRepository } from './src/applications/shared/persistence/repositories/prisma-user-repository'

async function main() {
  const repo = new PrismaUserRepository()
  console.log('Testing PrismaUserRepository...')
  try {
    const user = await repo.findByEmail('test@emasku.com')
    console.log('Result:', user)
  } catch (e) {
    console.error('Error:', e)
  }
}

main()
