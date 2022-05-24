const categoriesModel = require('../models/categoriesSchema')
const productModel = require('../models/productSchema')
const producCodeModel = require('../models/productCodeSchema')
const userModel = require('../models/userSchema')
const orderModel = require('../models/orderSchema')
const { comparePassword } = require('../services/auth')
const multer = require('multer')
const upload = multer({ dest: 'upload/' })


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
        let newCategories
        if (req.file) {
            let link = req.file.path
            newCategories = await categoriesModel.create({
                categoriesName: req.body.categoriesName,
                thumpNail: '/' + link,
            })
        } else {
            newCategories = await categoriesModel.create({
                categoriesName: req.body.categoriesName,
                thumpNail: req.body.thumpNail
            })
        }
        res.status(200).json(newCategories)
    } catch (error) {
        res.json(error)
    }
}

exports.editCategories = async function (req, res) {
    try {
        let fixCategories
        if (req.file) {
            let newLink = req.file.path
            fixCategories = await categoriesModel.updateOne(
                { _id: req.params.idCategories },
                {
                    categoriesName: req.body.categoriesName,
                    thumpNail: '/' + newLink,
                }
            )
        }
        else {
            fixCategories = await categoriesModel.updateOne(
                { _id: req.params.idCategories },
                {
                    categoriesName: req.body.categoriesName,
                    thumpNail: req.body.thumpNail
                }
            )
        }
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
        ).populate('idCategories')
        res.json(searchProductList)
    } catch (error) {
        res.json(error)
    }
}

exports.getListProductCode = async function (req, res) {
    try {
        let listProductCode = await producCodeModel.find()
        res.json(listProductCode)
    } catch (error) {
        console.log(error);
    }
}

exports.createProductCode = async function (req, res) {
    try {
        let newProductCode
        let alreadyProductCode = await producCodeModel.findOne({ productName: req.body.productName })
        if (alreadyProductCode) {
            return res.status(400).json({ status: 'ProductCode already exists' })
        } else {
            if (req.file) {
                newProductCode = await producCodeModel.create({
                    idCategories: req.body.idCategories,
                    productName: req.body.productName,
                    thumNail: '/' + req.file.path,
                    productType: req.body.productType,
                    performanceProduct: req.body.performanceProduct,
                    cameraProduct: req.body.cameraProduct,
                    specialFeatures: req.body.specialFeatures,
                    design: req.body.design,
                    panel: req.body.panel,
                    createDate: new Date()
                })
            } else {
                newProductCode = await producCodeModel.create({
                    idCategories: req.body.idCategories,
                    productName: req.body.productName,
                    thumNail: req.body.thumNail,
                    productType: req.body.productType,
                    performanceProduct: req.body.performanceProduct,
                    cameraProduct: req.body.cameraProduct,
                    specialFeatures: req.body.specialFeatures,
                    design: req.body.design,
                    panel: req.body.panel,
                    createDate: new Date()
                })
            }
            res.json(newProductCode)
        }
    } catch (error) {
        console.log(error);
    }
}

exports.editProductCode = async function (req, res) {
    try {
        let editProductCode
        if (req.file) {
            editProductCode = await producCodeModel.updateOne(
                { _id: req.params.idProductCode },
                {
                    idCategories: req.body.idCategories,
                    productName: req.body.productName,
                    thumNail: '/' + req.file.path,
                    productType: req.body.productType,
                    performanceProduct: req.body.performanceProduct,
                    cameraProduct: req.body.cameraProduct,
                    specialFeatures: req.body.specialFeatures,
                    design: req.body.design,
                    panel: req.body.panel,
                }
            )
        } else {
            editProductCode = await producCodeModel.updateOne(
                { _id: req.params.idProductCode },
                {
                    idCategories: req.body.idCategories,
                    productName: req.body.productName,
                    thumNail: req.body.thumNail,
                    productType: req.body.productType,
                    performanceProduct: req.body.performanceProduct,
                    cameraProduct: req.body.cameraProduct,
                    specialFeatures: req.body.specialFeatures,
                    design: req.body.design,
                    panel: req.body.panel,
                }
            )
        }
        res.json(editProductCode)
    } catch (error) {
        console.log(error);
    }
}

exports.deleteProductCode = async function (req, res) {
    try {
        let deleteProductCode = await producCodeModel.deleteOne(
            { _id: req.params.idProductCode }
        )
        res.json(deleteProductCode)
    } catch (error) {
        console.log(error);
    }
}

exports.getInforProduct = async function (req, res) {
    try {
        let productSelecter = await productModel.findOne(
            { _id: req.params.idProduct }
        ).populate('idProductCode')
        res.json(productSelecter)
    } catch (error) {
        console.log(error);
    }
}

exports.createProduct = async function (req, res) {
    try {
        let newProduct
        if (req.file) {
            newProduct = await productModel.create(
                {
                    idProductCode: req.body.idProductCode,
                    price: req.body.price,
                    priceRange: req.body.priceRange,
                    storage: req.body.storage,
                    productPic: '/' + req.file.path,
                    color: req.body.color,
                    ram: req.body.ram,
                    rom: req.body.rom,
                    productType: req.body.productType,
                    performanceProduct: req.body.performanceProduct,
                    cameraProduct: req.body.cameraProduct,
                    specialFeatures: req.body.specialFeatures,
                    design: req.body.design,
                    panel: req.body.panel,
                    createDate: new Date()
                }
            )
        } else {
            newProduct = await productModel.create(
                {
                    idProductCode: req.body.idProductCode,
                    price: req.body.price,
                    priceRange: req.body.priceRange,
                    storage: req.body.storage,
                    productPic: req.body.productPic,
                    color: req.body.color,
                    ram: req.body.ram,
                    rom: req.body.rom,
                    productType: req.body.productType,
                    performanceProduct: req.body.performanceProduct,
                    cameraProduct: req.body.cameraProduct,
                    specialFeatures: req.body.specialFeatures,
                    design: req.body.design,
                    panel: req.body.panel,
                    createDate: new Date()
                }
            )
        }
        res.json(newProduct)
    } catch (error) {
        console.log(error);
    }
}

exports.editProduct = async function (req, res) {
    try {
        let editProduct
        if (req.file) {
            editProduct = await productModel.updateOne(
                { _id: req.params.idProduct },
                {
                    idProductCode: req.body.idProductCode,
                    price: req.body.price,
                    priceRange: req.body.priceRange,
                    storage: req.body.storage,
                    productPic: '/' + req.file.path,
                    color: req.body.color,
                    ram: req.body.ram,
                    rom: req.body.rom,
                    productType: req.body.productType,
                    performanceProduct: req.body.performanceProduct,
                    cameraProduct: req.body.cameraProduct,
                    specialFeatures: req.body.specialFeatures,
                    design: req.body.design,
                    panel: req.body.panel,
                    suggest: req.body.suggest,
                }
            )
        } else {
            editProduct = await productModel.updateOne(
                { _id: req.params.idProduct },
                {
                    idProductCode: req.body.idProductCode,
                    price: req.body.price,
                    priceRange: req.body.priceRange,
                    storage: req.body.storage,
                    productPic: req.body.productPic,
                    color: req.body.color,
                    ram: req.body.ram,
                    rom: req.body.rom,
                    productType: req.body.productType,
                    performanceProduct: req.body.performanceProduct,
                    cameraProduct: req.body.cameraProduct,
                    specialFeatures: req.body.specialFeatures,
                    design: req.body.design,
                    panel: req.body.panel,
                    suggest: req.body.suggest,
                }
            )
        }
        res.json(editProduct)
    } catch (error) {
        console.log(error);
    }
}

exports.deleteProduct = async function (req, res) {
    try {
        let dropProduct = await productModel.deleteOne(
            { _id: req.params.idProduct }
        )
        res.json(dropProduct)
    } catch (error) {
        console.log(error);
    }
}

exports.getListUser = async function (req, res) {
    try {
        let listUser = await userModel.find()
        res.json(listUser)
    } catch (error) {
        console.log(error);
    }
}

exports.updateUserInfor = async function (req, res) {
    try {
        let updateUser
        if (req.file) {
            let link = req.file.path
            updateUser = await userModel.updateOne(
                { _id: req.params.idUser },
                {
                    username: req.body.username,
                    address: req.body.address,
                    phone: req.body.phone,
                    avatar: '/' + link,
                    role: req.body.role,
                }
            )
        } else {
            updateUser = await userModel.updateOne(
                { _id: req.params.idUser },
                {
                    username: req.body.username,
                    address: req.body.address,
                    phone: req.body.phone,
                    avatar: req.body.avatar,
                    role: req.body.role,
                }
            )
        }
        res.json(updateUser)
    } catch (error) {
        console.log(error);
    }
}

exports.deleteUser = async function (req, res) {
    try {
        let dropUser = userModel.deleteOne(
            { _id: req.params.idUser }
        )
        res.json(dropUser)
    } catch (error) {
        console.log(error);
    }
}

exports.getListOrderAd = async function (req, res) {
    try {
        let listOrderAd = await orderModel.find()
        res.json(listOrderAd)
    } catch (error) {
        console.log(error);
    }
}

exports.getListOrderFromUser = async function (req, res) {
    try {
        let listOrderFromUser = await orderModel.find(
            { idUser: req.params.idUer }
        ).populate('listProduct.idProduct').populate('idUser')
        res.json(listOrderFromUser)
    } catch (error) {
        console.log(error);
    }
}

exports.editOrder = async function (req, res) {
    try {
        let fixOrder = await orderModel.updateOne(
            { _id: req.params.idOrder },
            {
                address: req.body.address,
                total: req.body.total,
                phone: req.body.phone,
                status: req.body.status
            }
        )
        res.json(fixOrder)
    } catch (error) {
        console.log(error);
    }
}

exports.deleteOrder = async function (req, res) {
    try {
        let dropOrder = await orderModel.deleteOne(
            { _id: req.param.idOrder }
        )
        res.json(dropOrder)
    } catch (error) {
        console.log();
    }
}


exports.testCreateUser = async function (req, res) {
    try {
        let abc = await userModel.create(
            {
                email: req.body.email,
                password: req.body.password
            }
        )
        res.json(abc)
    } catch (error) {
        console.log(error);
    }
}