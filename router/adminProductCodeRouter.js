const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './views/assets/img/productCodeThumnail')
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
})
const upload = multer({ storage: storage })
router.get('/list', adminController.getListProductCode)
router.get('/product', adminController.searchProduct)
router.get('/:idProductCode', adminController.getInforProductCode)
router.post('/', upload.single('thumNail'), adminController.createProductCode)
router.put('/:idProductCode', upload.single('thumNail'), adminController.editProductCode)
router.delete('/:idProductCode', adminController.deleteProductCodeCD)

module.exports = router