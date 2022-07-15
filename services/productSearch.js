const producCodeModel = require('../models/productCodeSchema')
const categoriesModel = require('../models/categoriesSchema')
const productModel = require('../models/productSchema')
const { checkArray, flatten } = require('../utils/checkArray')
const fs = require('fs')
exports.filterProductCode = async function (req, res) {
    try {
        let listProduct;
        if (!req.idCategories) {
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

exports.testFillter = async function (request) {
    try {
        console.log(request);
        let listProduct = [];
        let list1;
        let list2;
        let list3;
        let list4;
        let list5;
        let list6;
        let data = [];
        if (request.idCategories) {
            list1 = await producCodeModel.find({ idCategories: request.idCategories })
        }
        if (request.name) {
            list2 = await producCodeModel.find(
                { productName: { $regex: request.search, $options: 'i' } }
            )
        }
        if (request.priceRange) {
            let listProductfollowPriceRange = await productModel.find(
                { priceRange: request.priceRange }
            )
            let datatest = []
            let allProductCode = await producCodeModel.find()
            for (let i = 0; i < listProductfollowPriceRange.length; i++) {
                for (let j = 0; j < allProductCode.length; j++) {
                    if (listProductfollowPriceRange[i].idProductCode === allProductCode[j]._id) {
                        datatest.push(allProductCode[j])
                    }
                }
            }
        }
        if (request.productType) {
            list4 = await producCodeModel.find({ productType: request.productType })
        }
        if (request.design) {
            list5 = await producCodeModel.find({ design: request.design })
        }
        if (request.max || request.min) {
            let allProductCode = await producCodeModel.find()
            if (request.max && request.min) {
                let listProductMaxMin = await productModel.find(
                    { price: { $lte: request.max, $gte: request.min } }
                )
                for (let i = 0; i < listProductMaxMin.length; i++) {

                }
            } else if (request.max && !request.min) {
                console.log(234);
            } else if (!request.max && request.min) {
                console.log(345);
            }
        }
        if (list1 || list2 || list3 || list4 || list5 || list6) {
            if (checkArray(list1) == true) {
                data.push(list1)
            }
            if (checkArray(list2) == true) {
                data.push(list2)
            }
            if (checkArray(list3) == true) {
                data.push(list3)
            }
            if (checkArray(list4) == true) {
                data.push(list4)
            }
            if (checkArray(list5) == true) {
                data.push(list5)
            }
            if (checkArray(list6) == true) {
                data.push(list6)
            }
            let a = flatten(data)

            // fs.writeFile("data.json", JSON.stringify(a), (err) => {
            //     if (err) {
            //         console.log(err);
            //     }
            // })
            let result = a.filter((filterValue, filterIndex) => {
                let index = a.findIndex((findValue) => {
                    return findValue._id === filterValue._id;
                })
                console.log(index.length);
                return index === filterIndex
            })
        } else {
            return "can't find any product! please try another select you want to search"
        }
        return listProduct
    } catch (error) {
        console.log(error);
    }
}