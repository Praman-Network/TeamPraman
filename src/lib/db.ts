import { PrismaClient } from '../generated/prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL!

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient,
  pool: Pool
}

const pool = globalForPrisma.pool || new Pool({ 
  connectionString,
  max: process.env.NODE_ENV === 'production' ? 10 : 2
})
const adapter = new PrismaPg(pool)

export const db = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
  globalForPrisma.pool = pool
}
