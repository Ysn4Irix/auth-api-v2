/**
 * @author Ysn4Irix
 * @email ysn4irix@gmail.com
 * @create date 30-06-2022
 * @modify date 30-06-2022
 * @desc [User Route]
 */

const router = require("express").Router()
const auth = require("../controllers/authController")
const {
    verifyAccessToken
} = require("../helpers/jwt")

/* register route */
router.post("/auth/register", auth.register)

/* login route */
router.post("/auth/login", auth.login)

/* refreshToken route */
router.post("/auth/refreshToken", auth.refreshToken)

/* logout route */
router.post("/auth/logout", auth.logout)

/* protected route */
router.get("/home", verifyAccessToken, auth.home)

module.exports = router