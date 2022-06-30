/**
 * @author Ysn4Irix
 * @email ysn4irix@gmail.com
 * @create date 30-06-2022
 * @modify date 30-06-2022
 * @desc [Redis Helper]
 */

const redis = require("redis")

const client = redis.createClient({
    port: 6379,
    host: "127.0.0.1",
})

client.connect().then(() => console.log("Client connected to redis..."))

client.on("ready", () => {
    console.log("Client connected to redis and ready to use...")
})

client.on("error", (err) => {
    console.log(err.message)
})

client.on("end", () => {
    console.log("Client disconnected from redis")
})

module.exports = client