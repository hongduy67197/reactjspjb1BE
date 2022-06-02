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
            const token = jwt.sign({ id: searchTokenUser._id }, 'projectFEB1', { expiresIn: 10 })
            await userModel.updateOne({ _id: searchTokenUser._id }, { token })
            res.json('user', token, { expires: new Date(Date.now() + 900000) })
            next()
        } else {
            res.json(error)
        }
    }
}

module.exports = { checkRoleUser, checkToken }