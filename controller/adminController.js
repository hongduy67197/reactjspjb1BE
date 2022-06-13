const categoriesModel = require("../models/categoriesSchema");
const productModel = require("../models/productSchema");
const producCodeModel = require("../models/productCodeSchema");
const userModel = require("../models/userSchema");
const orderModel = require("../models/orderSchema");
const { comparePassword } = require("../services/auth");
const multer = require("multer");
const iconModel = require("../models/iconSchema");
const cartsModel = require("../models/cartsSchema");
const upload = multer({ dest: "upload/" });
const {
    deleteProduct,
    deleteProductCode,
    deleteProductCodeCate,
} = require("../services/productCode");
const jwt = require('jsonwebtoken')
const sliderModel = require("../models/sliderSchema");

exports.adminLogin = async function (req, res) {
    try {
        const { email, password } = req.body
        const userCheck = await userModel.findOne({ email })
        const matchPasswordUser = await comparePassword(password, userCheck.password)
        if (!userCheck) {
            return res.json({ status: 'email or password undifind' })
        } else if (!userCheck.email) {
            return res.json({ status: 'account not avilable yet' })
        } else if (!matchPasswordUser) {
            return res.json({ status: 'undifind password' })
        } else if (userCheck && matchPasswordUser && userCheck.role != 'admin') {
            return res.json({ status: 'your account not enought role' })
        } else if (userCheck && matchPasswordUser && userCheck.role == 'admin') {
            let token = jwt.sign({ id: userCheck._id }, "projectFEB1", { expiresIn: 10 })
            await userModel.updateOne({ _id: userCheck._id }, { token })
            res.json({
                data: { token: token, role: userCheck.role, userData: userCheck },
                mess: 'oke',
            })
        }
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.getListCategories = async function (req, res) {
    try {
        let allCategories = await categoriesModel.find();
        res.status(200).json(allCategories);
    } catch (error) {
        res.json(error);
    }
};

exports.getInforCategories = async function (req, res) {
    try {
        let selectCategories = await categoriesModel.findOne({
            _id: req.params.idCategories,
        });
        res.json(selectCategories);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.createCategories = async function (req, res) {
    try {
        let newCategories;
        if (req.file) {
            let link = req.file.path;
            newCategories = await categoriesModel.create({
                categoriesName: req.body.categoriesName,
                thumpNail: "/" + link,
            });
        } else {
            newCategories = await categoriesModel.create({
                categoriesName: req.body.categoriesName,
                thumpNail: req.body.thumpNail,
            });
        }
        res.status(200).json(newCategories);
    } catch (error) {
        res.json(error);
    }
};

exports.editCategories = async function (req, res) {
    try {
        let fixCategories;
        if (req.file) {
            let newLink = req.file.path;
            fixCategories = await categoriesModel.updateOne(
                { _id: req.params.idCategories },
                {
                    categoriesName: req.body.categoriesName,
                    thumpNail: "/" + newLink,
                }
            );
        } else {
            fixCategories = await categoriesModel.updateOne(
                { _id: req.params.idCategories },
                {
                    categoriesName: req.body.categoriesName,
                    thumpNail: req.body.thumpNail,
                }
            );
        }
        res.status(200).json(fixCategories);
    } catch (error) {
        res.json(error);
    }
};

exports.deleteCategories = async function (req, res) {
    try {
        let listProductCode = await producCodeModel
            .find({ idCategories: req.params.idCategories })
            .select("_id");
        let listCodeId = listProductCode.map((value) => {
            return value._id;
        });
        let listProduct = await productModel.deleteMany({
            idProductCode: { $in: listCodeId },
        });
        let disCategories = await categoriesModel.deleteOne({
            _id: req.params.idCategories,
        });
        res.status(200).json(listProduct, disCategories);
    } catch (error) {
        res.json(error);
    }
};

exports.searchProduct = async function (req, res) {
    try {
        let searchProductList = await producCodeModel.find(
            { productName: { $regex: req.query.search, $options: 'i' } }
        ).populate('idCategories')
        res.json(searchProductList)
    } catch (error) {
        res.json(error)
    }
}

exports.getInforProductCode = async function (req, res) {
    try {
        let selectProductCode = await producCodeModel
            .findOne({ _id: req.params.idProductCode })
            .populate("idCategories");
        let listProdut = await productModel.find(
            { idProductCode: req.params.idProductCode }
        )
        selectProductCode._doc.listProduct = listProdut
        res.json(selectProductCode);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.getListProductCode = async function (req, res) {
    try {
        let listProductCode = await producCodeModel.find();
        res.json(listProductCode);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.createProductCode = async function (req, res) {
    try {
        let newProductCode;
        let alreadyProductCode = await producCodeModel.findOne({
            productName: req.body.productName,
        });
        if (alreadyProductCode) {
            return res.status(400).json({ status: "ProductCode already exists" });
        } else {
            if (req.file) {
                newProductCode = await producCodeModel.create({
                    idCategories: req.body.idCategories,
                    productName: req.body.productName,
                    thumNail: "/" + req.file.path,
                    productType: req.body.productType,
                    performanceProduct: req.body.performanceProduct,
                    cameraProduct: req.body.cameraProduct,
                    specialFeatures: req.body.specialFeatures,
                    design: req.body.design,
                    panel: req.body.panel,
                    Sale: req.body.Sale,
                    createDate: new Date(),
                });
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
                    Sale: req.body.Sale,
                    createDate: new Date(),
                });
            }
            res.json(newProductCode);
        }
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.editProductCode = async function (req, res) {
    try {
        let editProductCode;
        if (req.file) {
            editProductCode = await producCodeModel.updateOne(
                { _id: req.params.idProductCode },
                {
                    idCategories: req.body.idCategories,
                    productName: req.body.productName,
                    thumNail: "/" + req.file.path,
                    productType: req.body.productType,
                    performanceProduct: req.body.performanceProduct,
                    cameraProduct: req.body.cameraProduct,
                    specialFeatures: req.body.specialFeatures,
                    design: req.body.design,
                    panel: req.body.panel,
                    Sale: req.body.Sale,
                }
            );
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
                    Sale: req.body.Sale,
                }
            );
        }
        res.json(editProductCode);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.deleteProductCodeCD = async function (req, res) {
    try {
        let dropProductfollowPoductCode = await deleteProduct(
            req.params.idProductCode
        );
        let deleteProductCD = await deleteProductCode(req.params.idProductCode);
        res.json({ deleteProductCD, dropProductfollowPoductCode });
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.getListFollowProductCode = async function (req, res) {
    try {
        let data = await productModel.find(
            { idProductCode: req.params.idProductCode }
        ).populate('idProductCode')
        res.json(data)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.getListProduct = async function (req, res) {
    try {
        let listProduct = await productModel
            .find()
            .populate("idProductCode")
            .populate("icon");
        res.json(listProduct);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.getInforProduct = async function (req, res) {
    try {
        let productSelecter = await productModel
            .findOne({ _id: req.params.idProduct })
            .populate("idProductCode")
            .populate("icon");
        res.json(productSelecter);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.createProduct = async function (req, res) {
    try {
        let newProduct;
        if (req.file) {
            newProduct = await productModel.create({
                idProductCode: req.body.idProductCode,
                price: req.body.price,
                priceRange: req.body.priceRange,
                storage: req.body.storage,
                productPic: "/" + req.file.path,
                color: req.body.color,
                ram: req.body.ram,
                rom: req.body.rom,
                productType: req.body.productType,
                performanceProduct: req.body.performanceProduct,
                cameraProduct: req.body.cameraProduct,
                specialFeatures: req.body.specialFeatures,
                design: req.body.design,
                panel: req.body.panel,
                icon: req.body.icon,
                countSold: req.body.countSold,
                createDate: new Date(),
            });
        } else {
            newProduct = await productModel.create({
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
                icon: req.body.icon,
                countSold: req.body.countSold,
                createDate: new Date(),
            });
        }
        res.json(newProduct);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.editProduct = async function (req, res) {
    try {
        let editProduct;
        if (req.file) {
            editProduct = await productModel.updateOne(
                { _id: req.params.idProduct },
                {
                    idProductCode: req.body.idProductCode,
                    price: req.body.price,
                    priceRange: req.body.priceRange,
                    storage: req.body.storage,
                    productPic: "/" + req.file.path,
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
                    icon: req.body.icon,
                    countSold: req.body.countSold,
                }
            );
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
                    icon: req.body.icon,
                    countSold: req.body.countSold,
                }
            );
        }
        res.json(editProduct);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.deleteProduct = async function (req, res) {
    try {
        let dropProduct = await productModel.deleteOne({
            _id: req.params.idProduct,
        });
        res.json(dropProduct);
    } catch (error) {
        console.log(error);
    }
};

exports.getListUser = async function (req, res) {
    try {
        let listUser = await userModel.find();
        res.json(listUser);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.getInforUserSelect = async function (req, res) {
    try {
        let userSelecter = await userModel.findOne({ _id: req.params.idUser });
        res.json(userSelecter);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.updateUserInfor = async function (req, res) {
    try {
        let updateUser;
        if (req.file) {
            let link = req.file.path;
            updateUser = await userModel.updateOne(
                { _id: req.params.idUser },
                {
                    username: req.body.username,
                    address: req.body.address,
                    phone: req.body.phone,
                    avatar: "/" + link,
                    role: req.body.role,
                }
            );
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
            );
        }
        res.json(updateUser);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.deleteUser = async function (req, res) {
    try {
        let dropCartsUser = await cartsModel.deleteOne({
            idUser: req.params.idUser,
        });
        let dropUser = await userModel.deleteOne({ _id: req.params.idUser });
        res.json({ dropUser, dropCartsUser });
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.getListOrderAd = async function (req, res) {
    try {
        let listOrderAd = await orderModel.find();
        res.json(listOrderAd);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.getInforOrderSelect = async function (req, res) {
    try {
        let orderSelect = await orderModel
            .findOne({ _id: req.params.idOrder })
            .populate({ path: "listProduct.idProduct", populate: { path: 'idProductCode' } });
        res.json(orderSelect);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.getListOrderFromUser = async function (req, res) {
    try {
        let listOrderFromUser = await orderModel
            .find({ idUser: req.params.idUer })
            .populate("listProduct.idProduct")
            .populate("idUser");
        res.json(listOrderFromUser);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.editOrder = async function (req, res) {
    try {
        console.log(535, req.params);
        let fixOrder = await orderModel.updateOne(
            { _id: req.params.idOrder },
            {
                address: req.body.address,
                total: req.body.total,
                phone: req.body.phone,
                status: req.body.status,
            }
        );
        res.json(fixOrder);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.deleteOrder = async function (req, res) {
    try {
        let dropOrder = await orderModel.deleteOne({ _id: req.params.idOrder });
        res.json(dropOrder);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.testCreateUser = async function (req, res) {
    try {
        let abc = await userModel.create({
            email: req.body.email,
            password: req.body.password,
        });
        let abcCreateCarts = await cartsModel.create({
            idUser: abc._id,
        });
        res.json(abcCreateCarts);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.getListIcon = async function (req, res) {
    try {
        let listIcon = await iconModel.find();
        res.json(listIcon);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.searchIcon = async function (req, res) {
    try {
        let searchIconProduct = await iconModel.find(
            { iconName: { $regex: req.query.search, $options: 'i' } }
        )
        res.json(searchIconProduct)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.getNewIcon = async function (req, res) {
    try {
        let newIcon;
        if (req.file) {
            newIcon = await iconModel.create({
                iconName: req.body.iconName,
                iconPic: "/" + req.file.path,
                discount: req.body.discount,
            });
        } else {
            newIcon = await iconModel.create({
                iconName: req.body.iconName,
                iconPic: req.body.iconPic,
                discount: req.body.discount,
            });
        }
        res.json(newIcon);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.editIcon = async function (req, res) {
    try {
        let editProduct;
        if (req.file) {
            editProduct = await iconModel.updateOne(
                { _id: req.params.idIcon },
                {
                    iconName: req.body.iconName,
                    iconPic: "/" + req.file.path,
                    discount: req.body.discount,
                }
            );
        } else {
            editProduct = await iconModel.updateOne(
                { _id: req.params.idIcon },
                {
                    iconName: req.body.iconName,
                    iconPic: req.body.iconPic,
                    discount: req.body.discount,
                }
            );
        }
        res.json(editProduct);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.deleteIcon = async function (req, res) {
    try {
        let dropIcon = await iconModel.deleteOne({ _id: req.params.idIcon });
        res.json(dropIcon);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.getListSlide = async function (req, res) {
    try {
        let listSlide = await sliderModel.find();
        res.json(listSlide);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.searchSlide = async function (req, res) {
    try {
        let searchSlide = await sliderModel.find(
            { slideName: { $regex: req.query.search, $options: 'i' } }
        )
        res.json(searchSlide)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.getNewSlide = async function (req, res) {
    try {
        console.log(12313);
        let newSlide;
        if (req.file) {
            newSlide = await sliderModel.create({
                slideName: req.body.slideName,
                slideImg: "/" + req.file.path,
            });
        } else {
            newSlide = await sliderModel.create({
                slideName: req.body.slideName,
                slideImg: req.body.slideImg,
            });
        }
        res.json(newSlide);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.editSlide = async function (req, res) {
    try {
        let editSlide;
        if (req.file) {
            editSlide = await sliderModel.updateOne(
                { _id: req.params.idSlide },
                {
                    slideName: req.body.slideName,
                    slideImg: "/" + req.file.path,
                }
            );
        } else {
            editSlide = await sliderModel.updateOne(
                { _id: req.params.idSlide },
                {
                    slideName: req.body.slideName,
                    slideImg: req.body.slideImg,
                }
            );
        }
        res.json(editSlide);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
};

exports.deleteSlide = async function (req, res) {
    try {
        let dropSlide = await sliderModel.deleteOne(
            { _id: req.params.idSlide }
        )
        res.json(dropSlide)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.testCreateOrder = async function (req, res) {
    try {
        let newOrderFake = await orderModel.create(
            {
                idUser: req.body.idUser,
                address: req.body.address,
                total: req.body.total,
                phone: req.body.phone,
                listProduct: req.body.listProduct,
                status: req.body.status,
            }
        )
        res.json(newOrderFake)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}


exports.testEditOrder = async function (req, res) {
    try {
        let editOrder = await orderModel.updateOne(
            {
                _id: req.params.idOrder
            },
            {
                address: req.body.address,
                total: req.body.total,
                phone: req.body.phone,
                status: req.body.status,
                listProduct: req.body.listProduct
            }
        )
        res.json(editOrder)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

exports.testDeleteOrder = async function (req, res) {
    try {
        let testdropOrder = await orderModel.deleteOne(
            { _id: req.params.idOrder }
        )
        res.json(testdropOrder)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}

