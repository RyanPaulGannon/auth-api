import "dotenv/config"
import cors from "cors"
import bcrypt from "bcrypt"
import express, { Application, Request, Response, NextFunction } from "express"

import {
  checkIfClockNumberExists,
  checkIfEmailExists,
  registerUser,
} from "./database/userPrisma"
import { User } from "./types/userType"
import { sanitizeUserFrontEnd } from "./services/userService"

const app: Application = express()

app.use(cors({ origin: "*" }))
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.send("T&A API")
})

app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { name, email, clocknumber, password, repeatPassword } = req.body

  const encryptedPassword: string = await bcrypt.hash(password, 10)

  if (!name || !email || !clocknumber || !password || !repeatPassword) {
    return { statusCode: 400, statusMessage: "Invalid params" }
  }

  if (password !== repeatPassword) {
    return { statusCode: 400, statusMessage: "Passwords do not match" }
  }

  const userData: User = {
    name,
    email,
    clocknumber,
    password: encryptedPassword,
  }

  const emailInUse = await checkIfEmailExists(email)
  const clockNumberInUse = await checkIfClockNumberExists(clocknumber)

  if (emailInUse) return res.send("Email in use")
  if (clockNumberInUse) return res.send("Clocknumber in use")

  const registeredUser = await registerUser(userData)

  res.send({ body: sanitizeUserFrontEnd(registeredUser) })
})

app.listen(4000, () => console.log("Server running"))
