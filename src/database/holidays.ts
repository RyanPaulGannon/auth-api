import prisma from "."

export function requestHoliday(name: string, date: string) {
  return prisma.holidayBooking.create({
    data: {
      name,
      Dates: date,
    },
  })
}

export function checkDoubleBooking(name: string, date: string) {
  return prisma.holidayBooking.findFirst({
    where: {
      name,
      Dates: date,
    },
  })
}
