const express = require('express')
const router = express.Router();
const userController = require('../controller/userController')
const multer = require('multer')
const path = require('path');
const { checkToken } = require('../midderware/auth');
const userCommentRouter = require('./userCommentRouter')
const userCartsRouter = require('./userCartsRouter')
const userAccountRouter = require('./userAccountRouter')
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
router.post('/register', userController.register)
router.post('/login', userController.login)
router.use('/email', userAccountRouter)

// router.use(checkToken)
router.get('/', checkToken, userController.getUserInfor)
router.post('/refreshToken', userController.refeshToken)
router.post('/logout', checkToken, userController.logOut)
router.patch('/changePassword', checkToken, userController.changePassword)
router.put('/', checkToken, upload.single('avatar'), userController.editUserInfor)

// carts
router.use('/carts', userCartsRouter)

// productCode
router.get('/fillter', userController.getFillterProductCode)
router.get('/list', userController.getAdllProductCode)
router.get('/search', userController.getListSearchInput)
// product
router.get('/productlist', userController.getListProdutc)
router.get('/product_details', userController.getInforListProductCode)
router.post('/product', userController.checkIdProduct)

// order 

router.get('/orders', checkToken, userController.followOrderUser)
router.get('/order/:idOrder', checkToken, userController.getInforOrderSelect)
router.post('/order', checkToken, userController.createOrderUser)
router.delete('/order/:idOrder', checkToken, userController.deleteOrderUser)

// comment
router.use('/comment', userCommentRouter)
module.exports = router