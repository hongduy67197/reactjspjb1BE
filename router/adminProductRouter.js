const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './views/assets/img/productPic')
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
})
const upload = multer({ storage: storage })
router.get('/:idProduct', adminController.getInforProduct)
router.post('/', upload.single('productPic'), adminController.createProduct)
router.put('/idProduct', upload.single('productPic'), adminController.editProduct)
router.delete('/idProduct', adminController.deleteProduct)

module.exports = router