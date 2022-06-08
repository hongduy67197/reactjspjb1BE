const express = require('express')
const router = express.Router();
const categoriesRouter = require('./adminCategoriesRouter')
const productCodeRouetr = require('./adminProductCodeRouter')
const productRouyer = require('./adminProductRouter')
const userRouter = require('./adminUserRouter')
const orderRouter = require('./adminOrderRouter')
const slideRouter = require('./adminSlideRouter')
const iconRouter = require('./adminIconRouter');
const authRouter = require('./adminAuthRouter')
const { checkRoleUser } = require('../midderware/auth');
router.use('/auth', authRouter)
// router.use(checkRoleUser)
router.use('/categories', categoriesRouter);
router.use('/productcode', productCodeRouetr)
router.use('/product', productRouyer)
router.use('/user', userRouter)
router.use('/order', orderRouter)
router.use('/slide', slideRouter)
router.use('/icon', iconRouter)

module.exports = router