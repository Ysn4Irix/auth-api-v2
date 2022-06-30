/**
 * @author Ysn4Irix
 * @email ysn4irix@gmail.com
 * @create date 30-06-2022
 * @modify date 30-06-2022
 * @desc [authController]
 */

const User = require("../models/User.model")
const createError = require('http-errors')
const {
  hash,
  compare
} = require("bcrypt")
const {
  validateLogin,
  validateRegister,
  validateToken
} = require('../helpers/validations')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../helpers/jwt')
const client = require('../helpers/redis')

module.exports = {
  login: async (req, res, next) => {
    try {
      const {
        error
      } = await validateLogin(req.body)
      if (error) return next(error)

      const {
        email,
        password
      } = req.body

      const user = await User.findOne({
        email
      })
      if (!user)
        return next(new Error(createError.NotFound("User not found")))

      const isMatch = await compare(password, user.password)
      if (!isMatch)
        return next(new Error(createError.NotFound("Username/password not valid")))

      const accessToken = await signAccessToken(user.id)
      const refreshToken = await signRefreshToken(user.id)

      res.header("authtoken", accessToken)

      res.status(200).json({
        status: 200,
        message: "OK",
        response: {
          accessToken,
          refreshToken
        }
      })
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Invalid Username/Password'))
      next(error)
    }
  },
  register: async (req, res, next) => {
    try {
      const {
        error
      } = await validateRegister(req.body)
      if (error) return next(error)

      const {
        fullname,
        username,
        email,
        password
      } = req.body

      const doesExist = await User.findOne({
        email
      })
      if (doesExist)
        return next(createError.Conflict(`${email} is already been registered`))

      const hashedPass = await hash(password, 16)

      const user = new User({
        fullname,
        username,
        email,
        password: hashedPass
      })
      const savedUser = await user.save()
      const accessToken = await signAccessToken(savedUser.id)
      const refreshToken = await signRefreshToken(savedUser.id)

      res.status(200).json({
        status: 200,
        message: "OK",
        response: {
          accessToken,
          refreshToken
        }
      })
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const {
        error
      } = await validateToken(req.body)
      if (error) return next(error)

      const {
        refreshToken
      } = req.body

      const userId = await verifyRefreshToken(refreshToken)

      const accessToken = await signAccessToken(userId)
      const refToken = await signRefreshToken(userId)

      res.status(200).json({
        status: 200,
        message: "OK",
        response: {
          accessToken,
          refreshToken: refToken
        }
      })
    } catch (error) {
      next(error)
    }
  },
  logout: async (req, res, next) => {
    try {
      const {
        refreshToken
      } = req.body
      if (!refreshToken) return next(createError.BadRequest())

      const userId = await verifyRefreshToken(refreshToken)

      client.DEL(userId).then(val => {
        console.log(val)
        res.sendStatus(204)
      }).catch(err => {
        console.log(err.message)
        next(createError.InternalServerError())
      })
    } catch (error) {
      next(error)
    }
  },
  home: async (req, res, next) => {
    res.status(200).json({
      status: 200,
      message: "OK",
      response: {
        user: req.payload
      }
    })
  }
}

/* function longRunningTask() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("")
    }, 5000)
  })
} */