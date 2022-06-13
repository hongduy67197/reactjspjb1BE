const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const { checkToken } = require('../midderware/auth')

router.get('/', checkToken, userController.getListCarts)
router.patch('/', checkToken, userController.updateCarts)

module.exports = router