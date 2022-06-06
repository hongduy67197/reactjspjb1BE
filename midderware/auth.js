const userModel = require('../models/userSchema')
const jwt = require('jsonwebtoken')

async function checkRoleUser(req, res, next) {
    try {
        let token = req.headers.authorization
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

async function checkToken(req, res, next) {
    let searchTokenUser
    try {
        let token = req.headers.authorization
        // const check = await userModel.findOne({email: 'hoangcanon750d@gmail.com'})
        searchTokenUser = await userModel.findOne(
            { token: token }
        )
        if (searchTokenUser) {
            let id = jwt.verify(token, 'projectFEB1')
            console.log(id);
            if (id) {
                delete searchTokenUser._doc.token
                delete searchTokenUser._doc.password
                req.user = searchTokenUser
                next()
            }
        } else {
            res.json('cant not find user')

        }
    } catch (error) {
        if (error.message == 'jwt expired') {
            res.json({message: 'jwt expired'})
        } else {
            res.json(error)
        }
    }
}

module.exports = { checkRoleUser, checkToken }