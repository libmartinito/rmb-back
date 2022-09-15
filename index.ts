/**
 * Required External Modules
 */

import * as dotenv from "dotenv"
import express from "express"
import cors from "cors"
import bodyParser = require("body-parser")

import { router } from "./router"

dotenv.config()

/**
 * App Variables 
 */
let PORT: number

if (!process.env.PORT) {
    PORT = 3000
} else {
    PORT = parseInt(process.env.PORT as string, 10)
}

const app = express()

/**
 * App Configuration 
 */

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use("/uploads", express.static("uploads"))

app.use(router)

/**
 * Server Activation 
 */

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
