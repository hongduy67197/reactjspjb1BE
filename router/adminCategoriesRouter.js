const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './views/assets/img/categoriesPic')
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
})
const upload = multer({ storage: storage });
router.post('/', upload.single('thumpNail'), adminController.createCategories)
router.put('/:idCategories', adminController.editCategories)
router.delete('/:idCategories', adminController.deleteCategories)

module.exports = router