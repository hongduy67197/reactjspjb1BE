const userModel = require('../models/userSchema')
const jwt = require('jsonwebtoken')

async function checkRoleUser(req, res, next) {
    try {
        let token = req.cookies.user
        if (token) {
            let id = jwt.verify(token, 'projectFEB1')
            let checkIdUser = await userModel.findOne(
                { _id: id }
            )
            if (checkIdUser.role == "admin") {
                next()
            } else {
                res.json({ mess: "you dont have a role" })
            }
        } else {
            console.log("token is not defind");
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { checkRoleUser }