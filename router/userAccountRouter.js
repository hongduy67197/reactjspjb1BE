const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')

router.get('/:email/:code', userController.verifyEmail)
module.exports = router