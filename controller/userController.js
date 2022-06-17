const userModel = require("../models/userSchema");
const cartsModel = require("../models/cartsSchema");
const { hashPassword, comparePassword } = require("../services/auth");
const { generateCode, sendEMail } = require("../utils/utils");
const { CodeCheck } = require("../utils/utils");
const codeCheck = new CodeCheck();
const multer = require("multer");
const upload = multer({ dest: "upload/" });
const jwt = require("jsonwebtoken");
const productModel = require("../models/productSchema");
const producCodeModel = require("../models/productCodeSchema");
const ordersModel = require("../models/orderSchema");
const categoriesModel = require("../models/categoriesSchema");
const sliderModel = require("../models/sliderSchema");
const commentModel = require("../models/commentSchema");
const iconModel = require("../models/iconSchema");
const bcrypt = require("bcryptjs");

exports.register = async function (req, res) {
    try {
        const { password, email } = req.body;
        const alreadyExistEmail = await userModel.findOne({ email: email });
        if (alreadyExistEmail) {
            return res.status(400).json({ status: "Email already exists" });
        } else {
            const hashed = await hashPassword(password);
            const newUser = await userModel.create({
                email: email,
                password: hashed,
            });
            const newCart = await cartsModel.create({ idUser: newUser._id });
            // codeCheck.setCode(generateCode());
            // await sendEMail(newUser._id, email, codeCheck.getCode());
            // newUser.code = codeCheck.getCode();
            await newUser.save();
            res.status(200).json({ message: "create user success" });
        }
    } catch (error) {
        res.json(error);
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.params;
        const user = await userModel.findOne({ code }).catch((err) => {
            console.log(err);
        })
        user.email = email;
        user.code = '';
        await user.save()
        res.status(200).send(`create succes click <a href="http://localhost:3000/User/UserLogin">Here</a> to back web`)
    } catch (error) {
        res.status(400).send({ message: error })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        const matchPassword = await comparePassword(password, user.password);
        if (!user) {
            return res.json({ status: "user or password undifind" });
        } else if (!user.email) {
            return res.json({ status: "account not avilable yet" });
        } else if (!matchPassword) {
            return res.json({ status: "undifind password" });
        } else {
            let token = jwt.sign({ id: user._id }, "projectFEB1", { expiresIn: 10 });
            await userModel.updateOne({ _id: user._id }, { token });
            // res.cookie("user", token, { expires: new Date(Date.now() + 900000) });
            res.json({
                data: { token: token, role: user.role, userData: user },
                mess: "oke",
            });
        }
    } catch (error) {
        res.json(error);
    }
};

exports.logOut = async function (req, res) {
    try {
        let user = await userModel.updateOne(
            { _id: req.user._id },
            {
                token: "",
            }
        );
        res.status(200).json({ message: "logout success" });
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.changePassword = async function (req, res) {
    try {
        console.log(104, req.body);
        let users = await userModel.findOne({
            _id: req.user._id
        })
        let oldPassword = users.password;
        let inputPassword = req.body.password;
        let newPassword = req.body.newPassword;
        let checkPassword = await bcrypt.compare(inputPassword, oldPassword);
        let newPasswordBase;
        if (checkPassword == true) {
            newPasswordBase = bcrypt.hashSync(newPassword, 10);
            await userModel.updateOne(
                { _id: req.user._id },
                {
                    password: newPasswordBase,
                    token: "",
                }
            );
            res.status(200).json("change password success");
        } else {
            res.status(400).json("your password is not right");
        }
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.getUserInfor = async function (req, res) {
    try {
        res.json(req.user);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.editUserInfor = async function (req, res) {
    try {
        let userEdit;
        if (req.file) {
            let link = req.file.path;
            userEdit = await userModel.updateOne(
                { _id: req.user._id },
                {
                    username: req.body.username,
                    address: req.body.address,
                    phone: req.body.phone,
                    avatar: "/" + link,
                    birthDay: req.body.birthDay,
                }
            );
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
            );
        }
        res.json(userEdit);
    } catch (error) {
        res.json(168, error);
    }
};

exports.getListCarts = async function (req, res) {
    try {
        let userId = req.user._id;
        // let listProductCode = await producCodeModel.find()
        let listCartsUser = await cartsModel
            .find({ idUser: userId })
            .populate({ path: "listProduct.idProduct", populate: { path: 'idProductCode' } });
        let listCarts
        for (let i = 0; i < listCartsUser[0].listProduct.length; i++) {
            if (listCartsUser[0].listProduct[i].idProduct == null) {
                listCarts = await cartsModel.findOneAndUpdate({ idUser: userId }, { $pull: { listProduct: { _id: listCartsUser[0].listProduct[i]._id } } }, {
                    returnOriginal: false
                })
            } else if (!listCartsUser[0].listProduct[i].idProduct) {
                listCarts = await cartsModel.findOneAndUpdate({ idUser: userId }, { $pull: { listProduct: { idProduct: undefined } } }, {
                    returnOriginal: false
                })
            }
        }
        res.json({ listCarts, listCartsUser });
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.getListProdutc = async function (req, res) {
    try {
        let listCategories = await categoriesModel.find();
        let listProductList = await productModel.find();
        let listProductCode = await producCodeModel.find();
        res.json({ listProductList, listProductCode, listCategories });
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.checkIdProduct = async function (req, res) {
    try {
        let productCodeSelect = await producCodeModel.find({
            productName: req.query.productName,
        });
        let idProductCodecheck = productCodeSelect._id;
        let searchIdProduct = await productModel.find({
            idProductCode: idProductCodecheck,
            color: req.body.color,
            ram: req.body.ram,
            cameraProduct: req.body.cameraProduct,
        });
        res.json(searchIdProduct);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

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
            let listPrice = []
            let listCountSold = []
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
                    if (listPrice.indexOf(fillterList[i].price) == -1) {
                        listPrice.push(fillterList[i].price)
                    }
                    if (listCountSold.indexOf(fillterList[i].countSold) == -1) {
                        listCountSold.push(fillterList[i].countSold)
                    }
                }
                let countSold = 0;
                for (let k = 0; k < listCountSold.length; k++) {
                    if (listCountSold[k] == undefined) {
                        listCountSold[k] = 0;
                    }
                    countSold += listCountSold[k]
                }
                let price = Math.min(...listPrice)
                listProductCode[j]._doc.countSold = countSold
                listProductCode[j]._doc.price = price
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
            let listCatefories = await categoriesModel.find()
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
            let listPrice = []
            let listCountSold = []
            for (let i = 0; i < listProductCode.length; i++) {
                let fillterList = listProduct.filter(function (value) {
                    return (value.idProductCode == listProductCode[i]._id)
                })
                for (let j = 0; j < listCatefories.length; j++) {
                    if (listProductCode[i].idCategories[0] == listCatefories[j]._id) {
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
                    if (listPrice.indexOf(fillterList[k].price) == -1) {
                        listPrice.push(fillterList[k].price)
                    }
                    if (listCountSold.indexOf(fillterList[k].countSold) == -1) {
                        listCountSold.push(fillterList[k].countSold)
                    }
                }
                let countSold = 0;
                for (let h = 0; h < listCountSold.length; h++) {
                    countSold += listCountSold[h]
                }

                let price = Math.min(...listPrice)
                listProductCode[i]._doc.countSold = countSold
                listProductCode[i]._doc.price = price
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
        res.json({ listProductCode, listData });
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.getAdllProductCode = async function (req, res) {
    try {
        let listSlide = await sliderModel.find();
        let listCategories = await categoriesModel.find();
        let listProductCode = await producCodeModel.find();
        let listProduct = await productModel.find();
        let data = [];
        let listIcon = await iconModel.find();
        for (let i = 0; i < listProductCode.length; i++) {
            let filterList = listProduct.filter(function (value) {
                return value.idProductCode == listProductCode[i]._id;
            });
            listProductCode[i]._doc.data = filterList;
            let listPrice = [];
            let minPrice;
            let maxPrice;
            if (listProductCode[i]._doc.data.length > 0) {
                for (let j = 0; j < listProductCode[i]._doc.data.length; j++) {
                    for (let k = 0; k < listIcon.length; k++) {
                        if (listProductCode[i]._doc.data[j].icon == listIcon[k]._id) {
                            listProductCode[i]._doc.data[j].icon = listIcon[k];
                        }
                    }
                    if (listPrice.indexOf(listProductCode[i]._doc.data[j].price) == -1) {
                        listPrice.push(listProductCode[i]._doc.data[j].price)
                    }
                }
                minPrice = Math.min(...listPrice)
                maxPrice = Math.max(...listPrice)
            } else {
                minPrice = 0;
                maxPrice = 0;
                listPrice = [];
            }

            listProductCode[i]._doc.minPrice = minPrice
            listProductCode[i]._doc.maxPrice = maxPrice
            listProductCode[i]._doc.listPrice = listPrice
            data.push(listProductCode[i]);
        }
        let dataHome = {
            listCategories: listCategories,
            dataProductCode: data,
            listSlide: listSlide,
        };
        res.json(dataHome);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.getListSearchInput = async function (req, res) {
    try {
        let listSearchProductCode = await producCodeModel.find({
            productName: { $regex: `.*${req.query.search}*`, $options: "i" },
        });
        res.json(listSearchProductCode);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.getInforListProductCode = async function (req, res) {
    try {
        let getProductCode = await producCodeModel
            .findOne({ productName: req.query.productName })
            .populate("idCategories");
        let idProductCodeSelect = getProductCode._id;
        let listProductFollow = await productModel
            .find({ idProductCode: idProductCodeSelect })
            .populate("icon");
        let listComment = await commentModel
            .find({ idProductCode: idProductCodeSelect })
            .populate("idUser");
        getProductCode._doc.dataProduct = listProductFollow;
        getProductCode._doc.dataComment = listComment;
        res.json({ getProductCode });
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};
exports.updateCarts = async function (req, res) {
    try {
        let idProduct = req.body.idProduct;
        let quantity = req.body.quantity;
        let userId = req.user._id;
        let searchProduct = await cartsModel.findOne({
            idUser: userId,
        });
        console.log(484, searchProduct)
        let oldquantity;
        for (let i = 0; i < searchProduct.listProduct.length; i++) {
            if (idProduct === searchProduct.listProduct[i].idProduct) {
                oldquantity = searchProduct.listProduct[i].quantity;
            }
        }
        if (oldquantity) {
            let updateCartsQuantity
            if (quantity) {
                let newQuantity = Number(quantity) + oldquantity;
                updateCartsQuantity = await cartsModel.updateOne(
                    { idUser: userId, "listProduct.idProduct": idProduct },
                    { $set: { "listProduct.$.quantity": newQuantity } }
                );
            } else {
                updateCartsQuantity = await cartsModel.updateOne(
                    { idUser: userId, "listProduct.idProduct": idProduct },
                    { $pull: { listProduct: { idProduct: idProduct } } }
                );
            }
            res.json(updateCartsQuantity);
        } else {
            let fixCarts = await cartsModel.updateOne(
                { idUser: userId },
                {
                    cartsPrice: req.body.cartsPrice,
                    $push: {
                        listProduct: {
                            idProduct: idProduct,
                            quantity: quantity,
                        },
                    },
                }
            );
            res.json(fixCarts);
        }
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.followOrderUser = async function (req, res) {
    try {
        let listOrderUser = await ordersModel
            .find({ idUser: req.user._id })
            .populate({ path: "listProduct.idProduct", populate: { path: 'idProductCode' } })
        res.json(listOrderUser);
    } catch (error) {
        console.log(error);
    }
};

exports.getInforOrderSelect = async function (req, res) {
    try {
        let inforOrderSelect = await ordersModel
            .findOne({ _id: req.params.idOrder })
            .populate({ path: "listProduct.idProduct", populate: { path: 'idProductCode' } });
        res.json(inforOrderSelect);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.createOrderUser = async function (req, res) {
    try {
        let listProduct = await cartsModel.find({ idUser: req.user._id });
        let listProductOrder;
        listProductOrder = listProduct[0].listProduct;
        let newOrderUser = await ordersModel.create({
            idUser: req.user._id,
            address: req.body.address,
            total: req.body.total,
            phone: req.body.phone,
            listProduct: listProductOrder,
            status: "pending",
        });
        let olderQuality = listProduct[0].listProduct;
        for (let elm of olderQuality) {
            let CartsQuality = elm.quantity;
            let productAfterUpdate = await productModel.findOneAndUpdate(
                { _id: elm.idProduct },
                { $inc: { storage: -CartsQuality } }, { new: true }
            );
            await productAfterUpdate.checkStorage()
        }
        let clearCartsUser = await cartsModel.updateOne(
            { idUser: req.user._id },
            { listProduct: [] }
        );
        res.json(newOrderUser);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.deleteOrderUser = async function (req, res) {
    try {
        let dropOrderUser = await ordersModel.deleteOne({
            _id: req.params.idOrder,
        });
        res.json(dropOrderUser);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.createCommentProduct = async function (req, res) {
    try {
        let productSelecter = await producCodeModel.findOne({
            productName: req.query.productName,
        });
        let idProductCodeSelect = productSelecter._id;
        let newCommentProduct = await commentModel.create({
            idUser: req.user._id,
            idProductCode: idProductCodeSelect,
            commentContent: req.body.commentContent,
        });
        res.json(newCommentProduct);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.editCommentProduct = async function (req, res) {
    try {
        let editCommentPro = await commentModel.updateOne(
            {
                _id: req.params.idComment,
            },
            {
                commentContent: req.body.commentContent,
            }
        );
        res.json(editCommentPro);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.deleteCommentProduct = async function (req, res) {
    try {
        let dropComment = await commentModel.deleteOne({
            _id: req.params.idComment,
        });
        res.json(dropComment);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.refeshToken = async function (req, res) {
    try {
        let token = req.headers.authorization
        console.log(637, token);
        let searchTokenUser = await userModel.findOne(
            { token: token }
        )
        if (searchTokenUser) {
            const newToken = jwt.sign({ id: searchTokenUser._id }, 'projectFEB1', { expiresIn: 10 })
            console.log(52, token);
            await userModel.findOneAndUpdate({ _id: searchTokenUser._id }, { token: newToken })
            res.json({ token: newToken })
        }
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}