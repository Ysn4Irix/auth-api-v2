/**
 * @author Ysn4Irix
 * @email ysn4irix@gmail.com
 * @create date 29-06-2022
 * @modify date 29-06-2022
 * @desc [User Schema]
 */

const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("Users", userSchema)