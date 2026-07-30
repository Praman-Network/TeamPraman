import { PrismaClient } from './src/generated/prisma/client'
import Database from 'better-sqlite3'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })

const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    const users = await prisma.user.findMany()
    console.log(users)
  } catch (e) {
    console.error(e)
  }
}

main()
