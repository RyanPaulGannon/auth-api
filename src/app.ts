import "dotenv/config"
import cors from "cors"
import bcrypt from "bcrypt"
import express, { Application, Request, Response } from "express"

import {
  checkIfClockNumberExists,
  checkIfEmailExists,
  registerUser,
} from "./database/userPrisma"
import { User } from "./types/userType"
import { sanitizeUserFrontEnd } from "./services/userService"
import { getShifts, postShifts } from "./database/shifts"
import { requestHoliday } from "./database/holidays"
import { connect } from "./database"

const app: Application = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors({ origin: "*" }))
app.use(express.urlencoded({ extended: false }))

/* database */
connect()

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

  res.status(200).send({ body: sanitizeUserFrontEnd(registeredUser) })
})

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { clocknumber, password } = req.body

  const userExists = await checkIfClockNumberExists(clocknumber)

  if (!userExists) return res.send("User doesn't exist")

  const checkIfPasswordsMatch = await bcrypt.compare(
    password,
    userExists.password
  )

  if (!checkIfPasswordsMatch) return res.send("Passwords don't match")

  res.status(200).send({ body: sanitizeUserFrontEnd(userExists) })
})

app.post("/api/holidayrequest", async (req: Request, res: Response) => {
  const { name, date } = req.body
  await requestHoliday(name, date)
  res.status(200).send("Booked")
})

app
  .route("/api/auth/shifts")
  .post(async (req: Request, res: Response) => {
    const date = req.body.date
    const isoDate: any = date.toISOString()

    await postShifts(isoDate)
    res.send("Worked")
  })
  .get(async (req: Request, res: Response) => {
    const shifts = await getShifts()
    res.send(shifts.map((shift) => shift.Dates))
  })

app.listen(port, () => console.log(`Server running on ${port}`))
