<<<<<<< HEAD
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
=======
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
>>>>>>> 5115927cb5680e1508f796c51643fc4be708604d

exports.register = async function (req, res) {
  try {
    const { password, email } = req.body;
    const alreadyExistEmail = await userModel.findOne({ email: email });
    if (alreadyExistEmail) {
      return res.status(400).json({ status: "Email already exists" });
    } else {
      const hashed = await hashPassword(password);
      const newUser = await userModel.create({
        password: hashed,
      });
      const newCart = await cartsModel.create({ idUser: newUser._id });
      codeCheck.setCode(generateCode());
      await sendEMail(newUser._id, email, codeCheck.getCode());
      newUser.code = codeCheck.getCode();
      await newUser.save();
      res.status(200).json({ message: "check email" });
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
    });
    user.email = email;
    user.code = code;
    await user.save();
    res.status(200).send("create succes");
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

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
      let token = jwt.sign({ id: user._id }, "projectFEB1");
      await userModel.updateOne({ _id: user._id }, { token });
      res.cookie("user", token, { expires: new Date(Date.now() + 900000) });
      res.json({ data: { token: token, role: user.role }, mess: "oke" });
    }
  } catch (error) {
    res.json(error);
  }
};

exports.getUserInfor = async function (req, res) {
  try {
    console.log(req.user);
    res.json(req.user);
  } catch (error) {
    console.log(error);
  }
};

exports.editUserInfor = async function (req, res) {
  try {
    let userEdit;
    if (req.file) {
      let link = req.file.path;
      userEdit = await userModel.updateOne(
        { _id: req.params.idUser },
        {
          username: req.body.username,
          address: req.body.address,
          phone: req.body.phone,
          avatar: "/" + link,
        }
      );
    } else {
      userEdit = await userModel.updateOne(
        { _id: req.params.idUser },
        {
          username: req.body.username,
          address: req.body.address,
          phone: req.body.phone,
          avatar: req.body.avatar,
        }
      );
    }
    res.json(userEdit);
  } catch (error) {
    res.json(error);
  }
};

exports.getListCarts = async function (req, res) {
  try {
    let userId = req.query.userId;
    let listCartsUser = await cartsModel
      .find({ idUser: userId })
      .populate("listProduct.idProduct");
    res.json(listCartsUser);
  } catch (error) {
    console.log(error);
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
  }
};

exports.getFillterProductCode = async function (req, res) {
<<<<<<< HEAD
  try {
    let listProductCode = await producCodeModel.find({
      idCategories: req.query.idCategories,
    });
    res.json(listProductCode);
  } catch (error) {
    console.log(error);
  }
};
=======
    try {
        let listProductCode = await producCodeModel.find(
            { idCategories: req.query.idCategories }
        ).sort('createDate')
        let listCodeId = listProductCode.map((value => {
            return value._id
        }))
        let listProduct = await productModel.find({ idProductCode: { $in: listCodeId } })
        let listProductType = []
        let listRam = []
        let listPriceRange = []
        let listStorage = []
        let listRom = []
        let listCameraProduct = []
        let listSpecialFeatures = []
        for (let i = 0; i < listProduct.length; i++) {
            if (!listProductType.includes(listProduct[i])) {
                listProductType.push(listProduct[i])
            }
            if (!listRam.includes(listProduct[i])) {
                listRam.push(listProduct[i])
            }
            if (listPriceRange.indexOf(listProduct[i]) == -1) {
                listPriceRange.push(listProduct[i])
            }
            if (listStorage.indexOf(listProduct[i]) == -1) {
                listStorage.push(listProduct[i])
            }
            if (listRom.indexOf(listProduct[i]) == -1) {
                listRom.push(listProduct[i])
            }
            if (listCameraProduct.indexOf(listProduct[i]) == -1) {
                listCameraProduct.push(listProduct[i])
            }
            if (listSpecialFeatures.indexOf(listProduct[i]) == -1) {
                listSpecialFeatures.push(listProduct[i])
            }
        }
        let listData = {
            listProductType: listProductType,
            listRam: listRam,
            listPriceRange: listPriceRange,
            listStorage: listStorage,
            listRom: listRom,
            listCameraProduct: listCameraProduct,
            listSpecialFeatures: listSpecialFeatures,
        }
        res.json(listProductCode, listData)
    } catch (error) {
        console.log(error);
    }
}
>>>>>>> 5115927cb5680e1508f796c51643fc4be708604d

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
    }
}

exports.getInforListProductCode = async function (req, res) {
<<<<<<< HEAD
  try {
    let getProductCode = await producCodeModel.findOne({
      productName: req.query.productName,
    });
    let idProductCodeSelect = getProductCode._id;
    let listProductFollow = await productModel.find({
      idProductCode: idProductCodeSelect,
    });
    res.json({ listProduct: listProductFollow, productCode: getProductCode });
  } catch (error) {
    console.log(error);
  }
};
=======
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
    }
}
>>>>>>> 5115927cb5680e1508f796c51643fc4be708604d
exports.updateCarts = async function (req, res) {
  try {
    let idProduct = req.body.idProduct;
    let quantity = req.body.quantity;
    let searchProduct = await cartsModel.findOne({
      _id: req.query.cartsId,
    });

    let oldquantity;
    for (let i = 0; i < searchProduct.listProduct.length; i++) {
      if (idProduct === searchProduct.listProduct[i].idProduct) {
        oldquantity = searchProduct.listProduct[i].quantity;
      }
    }
    if (oldquantity) {
      let newQuantity = quantity;
      let updateCartsQuantity = await cartsModel.updateOne(
        { _id: req.query.cartsId, "listProducts.idproduct": idProduct },
        { $set: { "listProducts.$.quantity": newQuantity } }
      );
      res.json(updateCartsQuantity);
    } else {
      let fixCarts = await cartsModel.updateOne(
        { _id: req.query.cartsId },
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
  }
};

exports.followOrderUser = async function (req, res) {
  try {
    let listOrderUser = await ordersModel
      .find({ idUser: req.params.idUser })
      .populate("listProduct.idProduct")
      .populate("idUser");
    res.json(listOrderUser);
  } catch (error) {
    console.log(error);
  }
};

exports.getInforOrderSelect = async function (req, res) {
  try {
    let inforOrderSelect = await ordersModel
      .findOne({ _id: req.params.idOrder })
      .populate("listProduct.idProduct");
    res.json(inforOrderSelect);
  } catch (error) {
    console.log(error);
  }
};

exports.createOrderUser = async function (req, res) {
  try {
    let listProduct = await cartsModel.find({ idUser: req.body.idUser });
    let listProductOrder;
    listProductOrder = listProduct[0].listProduct;
    let newOrderUser = await ordersModel.create({
      idUser: req.body.idUser,
      address: req.body.address,
      total: req.body.total,
      phone: req.body.phone,
      listProduct: listProductOrder,
      status: "pending",
    });
    let olderQuality = listProduct[0].listProduct;
    for (let elm of olderQuality) {
      let CartsQuality = elm.quantity;
      await productModel.updateOne(
        { _id: elm.idProduct },
        { $inc: { storage: -CartsQuality } }
      );
    }
    let clearCartsUser = await cartsModel.updateOne(
      { idUser: req.body.idUser },
      { listProduct: [] }
    );
    res.json(newOrderUser);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteOrderUser = async function (req, res) {
<<<<<<< HEAD
  try {
    let dropOrderUser = await ordersModel.deleteOne({
      _id: req.params.idOrder,
    });
    res.json(dropOrderUser);
  } catch (error) {
    console.log(error);
  }
};
=======
    try {
        let dropOrderUser = await ordersModel.deleteOne(
            { _id: req.params.idOrder }
        )
        res.json(dropOrderUser)
    } catch (error) {
        console.log(error);
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
    }
}
>>>>>>> 5115927cb5680e1508f796c51643fc4be708604d
