/**
 * @author Ysn4Irix
 * @email ysn4irix@gmail.com
 * @create date 29-06-2022
 * @modify date 29-06-2022
 * @desc [Middlewares]
 */

const createError = require("http-errors")

const notFound = (req, res, next) => {
  next(createError.NotFound())
}

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    error: [{
      message: process.env.NODE_ENV === "production" ? createError.InternalServerError() : error.message,
      stack: process.env.NODE_ENV === "production" ? "🙄🙄" : error.stack,
    }, ],
  })
}

module.exports = {
  notFound,
  errorHandler,
}