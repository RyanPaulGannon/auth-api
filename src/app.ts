import "dotenv/config"
import cors from "cors"

import express, { Application, Request, Response, NextFunction } from "express"

const app: Application = express()

app.use(cors({ origin: "*" }))
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.send("T&A API")
})

app.post("/api/auth/register", (req: Request, res: Response) => {
  const { name, email, clocknumber, password, repeatPassword } = req.body
  console.log(name, email, clocknumber, password, repeatPassword)

  res.send("Worked")
})

app.listen(4000, () => console.log("Server running"))
