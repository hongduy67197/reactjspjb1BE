const producCodeModel = require('../models/productCodeSchema')
const categoriesModel = require('../models/categoriesSchema')
const productModel = require('../models/productSchema')
exports.filterProductCode = async function (req, res) {
    try {
        let listProduct;
        if (!req.query.idCategories) {
            if (req.query.name) {
                listProduct = await producCodeModel.find(
                    { productName: { $regex: req.query.search, $options: 'i' } }
                ).populate('idCategories')
            } else {
                if (req.query.name && req.query.max && req.query.min) {

                }
            }
        } else {
            if (req.query.idCategories && req.query.name) {
                listProduct = await producCodeModel.find({
                    idCategories: req.query.idCategories,
                    productName: { $regex: req.query.search, $options: 'i' },
                })
            } else if (req.query.idCategories && req.query.priceRange) {
                let productCodeSearch = await producCodeModel.find(
                    { idCategories: req.query.idCategories }
                )
                let productSearch = await productModel.find(
                    { priceRange: req.query.priceRange }
                )
                let listProductFilter = []
                for (let i = 0; i < productCodeSearch.length; i++) {
                    let list = productSearch.filter((product) => {
                        return product.idProductCode === productCodeSearch[i]._id
                    })
                    listProductFilter = [...listProductFilter, ...list]
                }
                listProduct = listProductFilter;
            }
        }
    } catch (error) {
        console.log(error);
    }
}