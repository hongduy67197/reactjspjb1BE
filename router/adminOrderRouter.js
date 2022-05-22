const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')

router.use('/', adminController.getListOrderAd)
router.use('/user/:idUer', adminController.getListOrderFromUser)
router.use('/:idOrder', adminController.editOrder)
router.use('/:idOrder', adminController.deleteOrder)
module.exports = router