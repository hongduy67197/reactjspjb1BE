const express = require('express')
const router = express.Router();
const userController = require('../controller/userController')
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './views/assets/img/avatar')
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
})

const upload = multer({ storage: storage })
// user
router.get('/:email/:code', userController.verifyEmail)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.put('/:idUser', upload.single('avatar'), userController.editUserInfor)

module.exports = router