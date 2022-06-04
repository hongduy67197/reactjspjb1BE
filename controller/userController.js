const userModel = require('../models/userSchema')
const cartsModel = require('../models/cartsSchema')
const { hashPassword, comparePassword } = require('../services/auth')
const { generateCode, sendEMail } = require('../utils/utils')
const { CodeCheck } = require('../utils/utils')
const codeCheck = new CodeCheck()
const multer = require('multer')
const upload = multer({ dest: 'upload/' })
const jwt = require('jsonwebtoken')
const productModel = require('../models/productSchema')
const producCodeModel = require('../models/productCodeSchema')
const ordersModel = require('../models/orderSchema')
const categoriesModel = require('../models/categoriesSchema')
const sliderModel = require('../models/sliderSchema')
const commentModel = require('../models/commentSchema')
const iconModel = require('../models/iconSchema')

exports.register = async function (req, res) {
    try {
        const { password, email } = req.body;
        const alreadyExistEmail = await userModel.findOne({ email: email })
        if (alreadyExistEmail) {
            return res.status(400).json({ status: 'Email already exists' })
        } else {
            const hashed = await hashPassword(password);
            const newUser = await userModel.create({
                password: hashed
            })
            const newCart = await cartsModel.create(
                { idUser: newUser._id }
            )
            codeCheck.setCode(generateCode())
            await sendEMail(newUser._id, email, codeCheck.getCode())
            newUser.code = codeCheck.getCode()
            await newUser.save()
            res.status(200).json({ message: 'check email' })
        }
    } catch (error) {
        res.json(error)
    }
}

exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.params;
        const user = await userModel.findOne({ code }).catch((err) => {
            console.log(err);
        })
        user.email = email;
        user.code = code;
        await user.save()
        res.status(200).send('create succes')
    } catch (error) {
        res.status(400).send({ message: error })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        const matchPassword = await comparePassword(password, user.password)
        if (!user) {
            return res.json({ status: 'user or password undifind' })
        } else if (!user.email) {
            return res.json({ status: 'account not avilable yet' })
        } else if (!matchPassword) {
            return res.json({ status: 'undifind password' })
        } else {
            let token = jwt.sign({ id: user._id }, 'projectFEB1', { expiresIn: 10 })
            await userModel.updateOne({ _id: user._id }, { token })
            res.cookie('user', token, { expires: new Date(Date.now() + 900000) })
            res.json({ data: { token: token, role: user.role, userData: user }, mess: 'oke' })
        }
    } catch (error) {
        res.json(error)
    }
}

exports.logOut = async function (req, res) {
    try {
        let user = await userModel.updateOne(
            { _id: req.user._id },
            {
                token: ''
            }
        )
        res.status(200).json({ message: 'logout success' })
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.getUserInfor = async function (req, res) {
    try {
        console.log(req.user);
        res.json(req.user)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.editUserInfor = async function (req, res) {
    try {
        let userEdit;
        if (req.file) {
            let link = req.file.path
            userEdit = await userModel.updateOne(
                { _id: req.user._id },
                {
                    username: req.body.username,
                    address: req.body.address,
                    phone: req.body.phone,
                    avatar: '/' + link,
                    birthDay: req.body.birthDay,
                }
            )
        } else {
            userEdit = await userModel.updateOne(
                { _id: req.user._id },
                {
                    username: req.body.username,
                    address: req.body.address,
                    phone: req.body.phone,
                    avatar: req.body.avatar,
                    birthDay: req.body.birthDay,
                }
            )
        }
        res.json(userEdit)
    } catch (error) {
        res.json(error)
    }
}

exports.getListCarts = async function (req, res) {
    try {
        let userId = req.user._id
        let listCartsUser = await cartsModel.find({ idUser: userId }).populate('listProduct.idProduct')
        res.json(listCartsUser)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.getListProdutc = async function (req, res) {
    try {
        let listCategories = await categoriesModel.find()
        let listProductList = await productModel.find()
        let listProductCode = await producCodeModel.find()
        res.json({ listProductList, listProductCode, listCategories })
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.checkIdProduct = async function (req, res) {
    try {
        let productCodeSelect = await producCodeModel.find(
            { productName: req.query.productName }
        )
        let idProductCodecheck = productCodeSelect._id
        let searchIdProduct = await productModel.find({
            idProductCode: idProductCodecheck,
            color: req.body.color,
            ram: req.body.ram,
            cameraProduct: req.body.cameraProduct,
        })
        res.json(searchIdProduct)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.getFillterProductCode = async function (req, res) {
    try {
        let listData
        let listProductCode
        if (req.query.idCategories) {
            let dataCategories
            dataCategories = await categoriesModel.findOne(
                { _id: req.query.idCategories }
            )
            listProductCode = await producCodeModel.find(
                { idCategories: req.query.idCategories }
            ).sort('createDate')
            let listCodeId = listProductCode.map((value => {
                return value._id
            }))
            let listProduct = await productModel.find({ idProductCode: { $in: listCodeId } })
            let listRam = []
            let listPriceRange = []
            let listStorage = []
            let listRom = []
            let listColor = []
            for (let i = 0; i < listProduct.length; i++) {
                if (!listColor.includes(listProduct[i].color)) {
                    listColor.push(listProduct[i].color)
                }
                if (!listRam.includes(listProduct[i].ram)) {
                    listRam.push(listProduct[i].ram)
                }
                if (listPriceRange.indexOf(listProduct[i].priceRange) == -1) {
                    listPriceRange.push(listProduct[i].priceRange)
                }
                if (listStorage.indexOf(listProduct[i].storage) == -1) {
                    listStorage.push(listProduct[i].storage)
                }
                if (listRom.indexOf(listProduct[i].rom) == -1) {
                    listRom.push(listProduct[i].rom)
                }
            }
            let ramRange = []
            let romRange = []
            let priceReferent = []
            for (let j = 0; j < listProductCode.length; j++) {
                let fillterList = listProduct.filter(function (value) {
                    return (value.idProductCode == listProductCode[j]._id)
                })
                for (let i = 0; i < fillterList.length; i++) {
                    if (ramRange.indexOf(fillterList[i].ram) == -1) {
                        ramRange.push(fillterList[i].ram)
                    }
                    if (romRange.indexOf(fillterList[i].rom) == -1) {
                        romRange.push(fillterList[i].rom)
                    }
                    if (priceReferent.indexOf(fillterList[i].priceRange) == -1) {
                        priceReferent.push(fillterList[i].priceRange)
                    }
                }
                listProductCode[j]._doc.romRange = romRange
                listProductCode[j]._doc.ramRange = ramRange
                listProductCode[j]._doc.priceReferent = priceReferent
                listProductCode[j]._doc.products = fillterList
                listProductCode[j]._doc.brand = dataCategories.categoriesName
            }
            listData = {
                listRam: listRam,
                listPriceRange: listPriceRange,
                listStorage: listStorage,
                listRom: listRom,
                listColor: listColor,
            }
        } else if (req.query.productName) {
            listProductCode = await producCodeModel.find(
                { productName: { $regex: req.query.productName, $options: 'i' } }
            ).sort('createDate')
            let listCodeId = listProductCode.map((value) => {
                return value._id
            })
            let listCatefories = await categoriesModel.find({ idProductCode: { $in: listCodeId } })
            let listProduct = await productModel.find()
            let listRam = []
            let listPriceRange = []
            let listStorage = []
            let listRom = []
            let listColor = []
            for (let i = 0; i < listProduct.length; i++) {
                if (!listColor.includes(listProduct[i].color)) {
                    listColor.push(listProduct[i].color)
                }
                if (!listRam.includes(listProduct[i].ram)) {
                    listRam.push(listProduct[i].ram)
                }
                if (listPriceRange.indexOf(listProduct[i].priceRange) == -1) {
                    listPriceRange.push(listProduct[i].priceRange)
                }
                if (listStorage.indexOf(listProduct[i].storage) == -1) {
                    listStorage.push(listProduct[i].storage)
                }
                if (listRom.indexOf(listProduct[i].rom) == -1) {
                    listRom.push(listProduct[i].rom)
                }
            }
            let ramRange = []
            let romRange = []
            let priceReferent = []
            for (let i = 0; i < listProductCode.length; i++) {
                let fillterList = listProduct.filter(function (value) {
                    return (value.idProductCode == listProductCode[i]._id)
                })
                for (let j = 0; j < listCatefories.length; j++) {
                    if (listProductCode[i].idCategories == listCatefories[j]._id) {
                        listProductCode[i]._doc.brand = listCatefories[j].categoriesName
                    }
                }
                for (let k = 0; k < fillterList.length; k++) {
                    if (ramRange.indexOf(fillterList[k].ram) == -1) {
                        ramRange.push(fillterList[k].ram)
                    }
                    if (romRange.indexOf(fillterList[k].rom) == -1) {
                        romRange.push(fillterList[k].rom)
                    }
                    if (priceReferent.indexOf(fillterList[k].priceRange) == -1) {
                        priceReferent.push(fillterList[k].priceRange)
                    }
                }
                listProductCode[i]._doc.romRange = romRange
                listProductCode[i]._doc.ramRange = ramRange
                listProductCode[i]._doc.priceReferent = priceReferent
                listProductCode[i]._doc.products = fillterList
            }
            listData = {
                listRam: listRam,
                listPriceRange: listPriceRange,
                listStorage: listStorage,
                listRom: listRom,
                listColor: listColor,
            }
        }
        res.json({ listProductCode, listData })
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.getAdllProductCode = async function (req, res) {
    try {
        let listSlide = await sliderModel.find()
        let listCategories = await categoriesModel.find()
        let listProductCode = await producCodeModel.find()
        let listProduct = await productModel.find()
        let data = []
        for (let i = 0; i < listProductCode.length; i++) {
            let filterList = listProduct.filter(function (value) {
                return (value.idProductCode == listProductCode[i]._id)
            })
            listProductCode[i]._doc.data = filterList
            data.push(listProductCode[i])
        }
        let dataHome = {
            listCategories: listCategories,
            dataProductCode: data,
            listSlide: listSlide
        }
        res.json(dataHome)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.getListSearchInput = async function (req, res) {
    try {
        let listSearchProductCode = await producCodeModel.find(
            { productName: { $regex: `.*${req.query.search}*`, $options: 'i' } }
        )
        res.json(listSearchProductCode)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.getInforListProductCode = async function (req, res) {
    try {
        let getProductCode = await producCodeModel.findOne(
            { productName: req.query.productName }
        ).populate('idCategories')
        let idProductCodeSelect = getProductCode._id
        let listProductFollow = await productModel.find(
            { idProductCode: idProductCodeSelect }
        ).populate('icon')
        let listComment = await commentModel.find(
            { idProductCode: idProductCodeSelect }
        ).populate('idUser')
        getProductCode._doc.dataProduct = listProductFollow
        getProductCode._doc.dataComment = listComment
        res.json({ getProductCode })
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}
exports.updateCarts = async function (req, res) {
    try {
        let idProduct = req.body.idProduct
        let quantity = req.body.quantity
        let userId = req.user._id
        let searchProduct = await cartsModel.findOne({
            idUser: userId
        })

        let oldquantity;
        for (let i = 0; i < searchProduct.listProduct.length; i++) {
            if (idProduct === searchProduct.listProduct[i].idProduct) {
                oldquantity = searchProduct.listProduct[i].quantity
            }
        }
        if (oldquantity) {
            let newQuantity = quantity
            let updateCartsQuantity = await cartsModel.updateOne(
                { idUser: userId, "listProducts.idproduct": idProduct },
                { $set: { "listProducts.$.quantity": newQuantity } }

            )
            res.json(updateCartsQuantity)
        } else {
            let fixCarts = await cartsModel.updateOne(
                { idUser: userId },
                {
                    cartsPrice: req.body.cartsPrice,
                    $push: {
                        listProduct: {
                            idProduct: idProduct,
                            quantity: quantity,
                        }
                    }
                }
            )
            res.json(fixCarts)
        }
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.followOrderUser = async function (req, res) {
    try {
        let listOrderUser = await ordersModel.find(
            { idUser: req.params.idUser }
        ).populate('listProduct.idProduct').populate('idUser')
        res.json(listOrderUser)
    } catch (error) {
        console.log(error);
    }
}

exports.getInforOrderSelect = async function (req, res) {
    try {
        let inforOrderSelect = await ordersModel.findOne(
            { _id: req.params.idOrder }
        ).populate('listProduct.idProduct')
        res.json(inforOrderSelect)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.createOrderUser = async function (req, res) {
    try {
        let listProduct = await cartsModel.find({ idUser: req.body.idUser })
        let listProductOrder;
        listProductOrder = listProduct[0].listProduct
        let newOrderUser = await ordersModel.create(
            {
                idUser: req.body.idUser,
                address: req.body.address,
                total: req.body.total,
                phone: req.body.phone,
                listProduct: listProductOrder,
                status: 'pending',
            }
        )
        let olderQuality = listProduct[0].listProduct
        for (let elm of olderQuality) {
            let CartsQuality = elm.quantity
            await productModel.updateOne(
                { _id: elm.idProduct },
                { $inc: { storage: -CartsQuality } }
            )
        }
        let clearCartsUser = await cartsModel.updateOne(
            { idUser: req.body.idUser },
            { listProduct: [] }
        )
        res.json(newOrderUser)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.deleteOrderUser = async function (req, res) {
    try {
        let dropOrderUser = await ordersModel.deleteOne(
            { _id: req.params.idOrder }
        )
        res.json(dropOrderUser)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.createCommentProduct = async function (req, res) {
    try {
        let productSelecter = await producCodeModel.findOne(
            { productName: req.query.productName }
        )
        let idProductCodeSelect = productSelecter._id
        let newCommentProduct = await commentModel.create(
            {
                idUser: req.user._id,
                idProductCode: idProductCodeSelect,
                commentContent: req.body.commentContent,
            }
        )
        res.json(newCommentProduct)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.editCommentProduct = async function (req, res) {
    try {
        let editCommentPro = await commentModel.updateOne(
            {
                _id: req.params.idComment,
            },
            {
                commentContent: req.body.commentContent,
            }
        )
        res.json(editCommentPro)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.deleteCommentProduct = async function (req, res) {
    try {
        let dropComment = await commentModel.deleteOne(
            { _id: req.params.idComment }
        )
        res.json(dropComment)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}