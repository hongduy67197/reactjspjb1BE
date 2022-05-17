const userModel = require('../models/userSchema')
const cartsModel = require('../models/cartsSchema')
const { hashPassword, comparePassword } = require('../services/auth')
const { generateCode, sendEMail } = require('../utils/utils')
const { CodeCheck } = require('../utils/utils')
const codeCheck = new CodeCheck()
const multer = require('multer')
const upload = multer({ dest: 'upload/' })
const jwt = require('jsonwebtoken')

exports.register = async function (req, res) {
    try {
        const { password, email } = req.body;
        console.log(password, email);
        const alreadyExistEmail = await userModel.findOne({ email: email })
        const abc = await userModel.find();
        if (alreadyExistEmail) {
            return res.status(400).json({ status: 'Email already exists' })
        } else {
            const hashed = await hashPassword(password);
            const newUser = await userModel.create({
                password: hashed
            })
            const newCart = await cartsModel.create(
                { idUser: newUser._id }
            )
            codeCheck.setCode(generateCode())
            await sendEMail(newUser._id, email, codeCheck.getCode())
            newUser.code = codeCheck.getCode()
            await newUser.save()
            res.status(200).json({ message: 'check email' })
        }
    } catch (error) {
        res.json(error)
    }
}

exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.params;
        const user = await userModel.findOne({ code }).catch((err) => {
            console.log(err);
        })
        user.email = email;
        user.code = code;
        await user.save()
        return res.status(200).send('create succes')
    } catch (error) {
        return res.status(400).send({ message: error })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        const matchPassword = await comparePassword(password, user.password)
        if (!user) {
            return res.json({ status: 'user or password undifind' })
        } else if (!user.email) {
            return res.json({ status: 'account not avilable yet' })
        } else if (!matchPassword) {
            return res.json({ status: 'undifind password' })
        } else {
            let token = jwt.sign({ id: user._id }, 'projectFEB1')
            res.cookie('user', token, { expires: new Date(Date.now() + 900000) })
            res.json({ data: { token: token, role: user.role }, mess: 'oke' })
        }
    } catch (error) {
        res.json(error)
    }
}

exports.editUserInfor = async function (req, res) {
    try {
        let link = req.file.path
        let userEdit = await userModel.updateOne(
            { _id: req.params.idUser },
            {
                username: req.body.username,
                address: req.body.address,
                phone: req.body.phone,
                avatar: link,
            }
        )
        res.json(userEdit)
    } catch (error) {
        res.json(error)
    }
}