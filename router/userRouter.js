const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const multer = require("multer");
const path = require("path");
const { checkToken } = require("../midderware/auth");
const { findByIdAndUpdate } = require("../models/categoriesSchema");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./views/assets/img/avatar");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
// user
router.get("/:email/:code", userController.verifyEmail);
router.get("/", checkToken, userController.getUserInfor);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/:idUser", upload.single("avatar"), userController.editUserInfor);

// carts
router.get("/carts", userController.getListCarts);
router.put("/carts", userController.updateCarts);

// productCode
<<<<<<< HEAD
router.get("/fillter", userController.getFillterProductCode);

=======
router.get('/fillter', userController.getFillterProductCode)
router.get('/list', userController.getAdllProductCode)
>>>>>>> f7d38a4344216d9445a2ff6367c1b8863b44d6d3
// product
router.get("/productlist", userController.getListProdutc);
router.get("/product_details", userController.getInforListProductCode);
router.post("/product", userController.checkIdProduct);

// order
router.get("/orders/:idUser", userController.followOrderUser);
router.get("/order/:idOrder", userController.getInforOrderSelect);
router.post("/order", userController.createOrderUser);
router.delete("/order/:idOrder", userController.deleteOrderUser);

module.exports = router;
