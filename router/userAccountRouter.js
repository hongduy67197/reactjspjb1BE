const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')

router.get('/:email/:code', userController.verifyEmail)
router.post('/checkCode', userController.mailCodeForgotPass)
module.exports = router