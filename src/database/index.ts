import Prisma from "@prisma/client"

const { PrismaClient } = Prisma

const prisma = new PrismaClient()

export async function connect() {
  await prisma.$connect()
  console.log("Connected")
}

export default prisma
