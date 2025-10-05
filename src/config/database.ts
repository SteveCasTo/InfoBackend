import { PrismaClient } from '@prisma/client'
import { IS_DEVELOPMENT } from '../utils/constants'

export const prisma = new PrismaClient({
  log: IS_DEVELOPMENT ? ['error', 'warn'] : ['error']
})

export const connectDatabase = async () => {
  try {
    await prisma.$connect()
    if (IS_DEVELOPMENT) {
      console.log('Base de datos conectada')
    }
  } catch (error) {
    console.error('Error conectando a la base de datos:', error)
    process.exit(1)
  }
}

export const disconnectDatabase = async () => {
  await prisma.$disconnect()
}