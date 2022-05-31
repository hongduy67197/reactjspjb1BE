const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')

router.get('/', adminController.getListOrderAd)
router.get('/:idOrder', adminController.getInforOrderSelect)
router.get('/user/:idUer', adminController.getListOrderFromUser)
router.put('/:idOrder', adminController.editOrder)
router.delete('/:idOrder', adminController.deleteOrder)
module.exports = router