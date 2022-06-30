/**
 * @author Ysn4Irix
 * @email ysn4irix@gmail.com
 * @create date 30-06-2022
 * @modify date 30-06-2022
 * @desc [JSOn Web Token Helper]
 */

const JWT = require("jsonwebtoken")
const createError = require("http-errors")
const client = require("./redis")

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: "1h",
                issuer: "ysnirix.me",
                audience: userId,
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                    return
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        const token = req.headers["authtoken"]
        if (!token) return next(createError.Unauthorized())

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message =
                    err.name === "JsonWebTokenError" ? "Unauthorized" : err.message
                return next(createError.Unauthorized(message))
            }
            req.payload = payload
            next()
        })
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn: "1y",
                issuer: "ysnirix.me",
                audience: userId,
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                }

                client.SET(userId, token, {
                    "EX": 365 * 24 * 60 * 60
                }).then(() => resolve(token)).catch(err => {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                    return
                })
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, payload) => {
                    if (err) return reject(createError.Unauthorized())
                    const userId = payload.aud
                    client.GET(userId).then(result => {
                        if (refreshToken === result) return resolve(userId)
                        reject(createError.Unauthorized())
                    }).catch(err => {
                        console.log(err.message)
                        reject(createError.InternalServerError())
                        return
                    })
                }
            )
        })
    },
}