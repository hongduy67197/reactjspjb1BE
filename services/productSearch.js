const producCodeModel = require('../models/productCodeSchema')
const categoriesModel = require('../models/categoriesSchema')
const productModel = require('../models/productSchema')
const { checkArray, flatten, createPriceQuery, satisfiedProductList, filterDuplicatesInArray } = require('../utils/checkArray')
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
        // let testList = []
        console.log(request);
        // let listCode = ['design', 'idCategories']
        // let query = '{'
        // for (let k in request) {
        //     if (listCode.indexOf(k) !== -1) {
        //         console.log(56, query);
        //         let a = await producCodeModel.find({ query })
        //         testList.push(a)
        //     } else {

        //     }
        // }
        // let b = flatten(testList)
        // console.log(62, b.length);
        // fs.writeFile("data.json", JSON.stringify(b), (err) => {
        //     if (err) {
        //         console.log(err);
        //     }
        // })
        // let check = filterDuplicatesInArray(b)
        // console.log(64, check.length);


        let listProduct;
        let list1;
        let list2;
        let list3;
        let list4;
        let list5;
        let list6;
        let list7;
        let list8;
        let data = [];
        if (request.idCategories) {
            list1 = await producCodeModel.find({ idCategories: { $in: request.idCategories } })
        }
        if (request.name) {
            list2 = await producCodeModel.find(
                { productName: { $regex: request.search, $options: 'i' } }
            )
        }
        if (request.priceRange) {
            let listProductfollowPriceRange = await productModel.find(
                { priceRange: { $in: request.priceRange } }
            )
            let allProductCode = await producCodeModel.find().populate('idCategories')
            list3 = satisfiedProductList(allProductCode, listProductfollowPriceRange)
        }
        if (request.productType) {
            list4 = await producCodeModel.find({ productType: { $in: request.productType } })
        }
        if (request.design) {
            list5 = await producCodeModel.find({ design: { $in: request.design } })
        }
        if (request.max || request.min) {
            let query = createPriceQuery(request.min, request.max)
            let allProductCode = await producCodeModel.find().populate('idCategories')
            let listProductMaxandMin = await productModel.find(query)
            list6 = satisfiedProductList(allProductCode, listProductMaxandMin)
        }
        if (request.ram) {
            let listProductfollowRam = await productModel.find(
                { ram: { $in: request.ram } }
            )
            let allProductCode = await producCodeModel.find().populate('idCategories')
            list7 = satisfiedProductList(allProductCode, listProductfollowRam)
        }
        if (request.rom) {
            let listProductfollowRam = await productModel.find(
                { rom: { $in: request.rom } }
            )
            let allProductCode = await producCodeModel.find().populate('idCategories')
            list8 = satisfiedProductList(allProductCode, listProductfollowRam)
        }
        if (list1 || list2 || list3 || list4 || list5 || list6 || list7 || list8) {
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
            if (checkArray(list7) == true) {
                data.push(list7)
            }
            if (checkArray(list8) == true) {
                data.push(list8)
            }
            let a = flatten(data)
            listProduct = filterDuplicatesInArray(a)
            console.log(listProduct.length);
        } else {
            return "can't find any product! please try another select you want to search"
        }
        return listProduct
    } catch (error) {
        console.log(error);
    }
}