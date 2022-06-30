/**
 * @author Ysn4Irix
 * @email ysn4irix@gmail.com
 * @create date 30-06-2022
 * @modify date 30-06-2022
 * @desc [Entry Point]
 */

require("dotenv").config()
const express = require("express")
const logger = require("morgan")
const helmet = require("helmet")
const client = require("./helpers/redis")
const responseTime = require("response-time")
const {
  connect,
  connection
} = require("mongoose")

const userRouter = require("./routes/User.route")
const middlewares = require("./helpers/middlewares")

const app = express()

app.use(logger("dev"))
app.use(responseTime())
app.use(helmet())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

connect(process.env.MONGODB_URL)

connection.on("connected", () => {
  console.log("🎉 mongoose connected to db")
})

connection.on("error", (err) => {
  console.log("mongoose connection error.", err.message)
})

connection.on("disconnected", () => {
  console.log("mongoose connection is disconnected.")
})

app.use("/api/v2", userRouter)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log(`🚀 server started => listening on PORT: ${port} with processId: ${process.pid}`)
})

process.on("SIGINT", () => {
  console.info("SIGINT signal received.")
  console.log("server is closing.")
  server.close(() => {
    console.log("server closed.")
    connection.close(false, () => {
      client.quit()
      process.exit(0)
    })
  })
})

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.")
  console.log("server is closed.")
  server.close(() => {
    console.log("server closed.")
    connection.close(false, () => {
      client.quit()
      process.exit(0)
    })
  })
})

module.exports = app