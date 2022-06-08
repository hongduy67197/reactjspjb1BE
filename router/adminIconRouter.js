const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./views/assets/img/iconimg");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.filename + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
router.get("/list", adminController.getListIcon);
router.get("/search", adminController.searchIcon);
router.post("/", upload.single("iconPic"), adminController.getNewIcon);
router.put("/:idIcon", upload.single("iconPic"), adminController.editIcon);
router.delete("/:idIcon", adminController.deleteIcon);

module.exports = router;