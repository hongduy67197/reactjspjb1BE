const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const { checkToken } = require('../midderware/auth')

router.get('/', userController.getListCarts)
router.patch('/',  userController.updateCarts)

module.exports = router