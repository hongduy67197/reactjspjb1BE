const express = require('express')
const router = express.Router();
const categoriesRouter = require('./adminCategoriesRouter')

router.use('/categories', categoriesRouter);

module.exports = router