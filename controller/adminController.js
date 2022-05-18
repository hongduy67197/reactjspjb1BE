const categoriesModel = require('../models/categoriesSchema')
const productModel = require('../models/productSchema')
const producCodeModel = require('../models/productCodeSchema')
const userModel = require('../models/userSchema')
const { comparePassword } = require('../services/auth')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })


exports.getListCategories = async function (req, res) {
    try {
        let allCategories = await categoriesModel.find()
        res.status(200).json(allCategories);
    } catch (error) {
        res.json(error)
    }
}

exports.createCategories = async function (req, res) {
    try {
        let link = req.file.path
        console.log(22, link);
        let newCategories = await categoriesModel.create({
            categoriesName: req.body.categoriesName,
            thumpNail: '/' + link,
        })
        res.status(200).json(newCategories)
    } catch (error) {
        res.json(error)
    }
}

exports.editCategories = async function (req, res) {
    try {
        let newLink = req.file.path
        let fixCategories = await categoriesModel.updateOne(
            { _id: req.params.idCategories },
            {
                categoriesName: req.body.categoriesName,
                thumpNail: '/' + newLink,
            }
        )
        res.status(200).json(fixCategories)
    } catch (error) {
        res.json(error)
    }
}

exports.deleteCategories = async function (req, res) {
    try {
        let disCategories = await categoriesModel.deleteOne(
            { _id: req.params.idCategories }
        )
        res.status(200).json(disCategories)
    } catch (error) {
        res.json(error)
    }
}

exports.searchProduct = async function (req, res) {
    try {
        let searchProductList = await producCodeModel.find(
            { productName: { $regex: `.*${req.query.search}*` } }
        )
        res.json(searchProductList)
    } catch (error) {
        res.json(error)
    }
}

