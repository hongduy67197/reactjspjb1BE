const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')

router.get('/', adminController.getListOrderAd)
router.get('/listOrder', adminController.getListOrderStatus)
router.get('/:idOrder', adminController.getInforOrderSelect)
router.get('/user/:idUer', adminController.getListOrderFromUser)
router.put('/:idOrder', adminController.editOrder)
router.delete('/:idOrder', adminController.deleteOrder)
router.post('/test', adminController.testCreateOrder)
router.put('/test/:idOrder', adminController.testEditOrder)
router.delete('/test/:idOrder', adminController.testDeleteOrder)
module.exports = router