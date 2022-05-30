const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './views/assets/img/sliderImg')
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.filename + "-" + Date.now() + path.extname(file.originalname)
        )
    }
})
const upload = multer({ storage: storage })
router.get('/list', adminController.getListSlide)
router.get('/search', adminController.searchSlide)
router.post('/', upload.single('slideImg'), adminController.getNewSlide)
router.put('/:idSlide', upload.single('slideImg'), adminController.editSlide)
router.delete('/:idSlide', adminController.deleteSlide)

module.exports = router