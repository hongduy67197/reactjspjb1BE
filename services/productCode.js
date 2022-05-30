const producCodeModel = require('../models/productCodeSchema')
const productModel = require('../models/productSchema')

exports.deleteProduct = async function (idProductCode) {
    return productModel.deleteMany(
        { idProductCode }
    )
}

exports.deleteProductCode = async function (idProductCode) {
    return producCodeModel.deleteMany(
        { _id: idProductCode }
    )
}

exports.deleteProductCodeCate = async function (idCategories) {
    return producCodeModel.deleteMany(
        { idCategories: idCategories }
    )
}
