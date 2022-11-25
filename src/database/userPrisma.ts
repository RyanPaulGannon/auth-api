import prisma from "."

export function checkIfEmailExists(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export function checkIfClockNumberExists(clocknumber: string) {
  return prisma.user.findUnique({
    where: { clocknumber },
  })
}

export function registerUser(newUserData: any) {
  return prisma.user.create({
    data: newUserData,
  })
}
