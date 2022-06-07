const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const multer = require('multer')
const path = require('path')
const { checkToken } = require('../midderware/auth')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './views/assets/user/commentPic')
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
})
const upload = multer({ storage: storage })
router.post('/', checkToken, upload.single('commentImg'), userController.createCommentProduct)
router.put('/:idComment', checkToken, upload.single('commentImg'), userController.editCommentProduct)
router.delete('/:idComment', checkToken, userController.deleteCommentProduct)

module.exports = router