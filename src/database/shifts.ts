import prisma from "."

export function postShifts(date: Date) {
  return prisma.shift2A.create({
    data: {
      Dates: { set: date },
    },
  })
}

export function getShifts() {
  return prisma.shift2A.findMany()
}
