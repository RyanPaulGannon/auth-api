import { User } from "../types/userType"

export function sanitizeUserFrontEnd(user: User) {
  if (!user) user

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}
