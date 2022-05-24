const express = require('express')
const router = express.Router();
const categoriesRouter = require('./adminCategoriesRouter')
const productCodeRouetr = require('./adminProductCodeRouter')
const productRouyer = require('./adminProductRouter')
const userRouter = require('./adminUserRouter')
const orderRouter = require('./adminOrderRouter')

router.use('/categories', categoriesRouter);
router.use('/productcode', productCodeRouetr)
router.use('/product', productRouyer)
router.use('/user', userRouter)
router.use('/order', orderRouter)

module.exports = router