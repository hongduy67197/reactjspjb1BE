const express = require('express')
const router = express.Router();
const categoriesRouter = require('./adminCategoriesRouter')
const productCodeRouetr = require('./adminProductCodeRouter')
const productModel = require('./adminProductCodeRouter')

router.use('/categories', categoriesRouter);
router.use('/productcode', productCodeRouetr)
router.use('/product', productModel)

module.exports = router