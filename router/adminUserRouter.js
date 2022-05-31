const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const path = require('path')
const multer = require('multer')
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
router.get('/', adminController.getListUser)
router.get('/:idUser', adminController.getInforUserSelect)
router.post('/', adminController.testCreateUser)
router.put('/:idUser', upload.single('avatar'), adminController.updateUserInfor)
router.delete('/:idUser', adminController.deleteUser)


module.exports = router