import "dotenv/config"
import cors from "cors"

import express, { Application, Request, Response, NextFunction } from "express"

const app: Application = express()

app.use(cors({ origin: "*" }))
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.send("T&A API")
})
