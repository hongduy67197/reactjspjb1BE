const router = require("express").Router();
const path = require("path");
const { checkToken } = require("../midderware/auth");
const adminRouter = require("./adminRouter");
const userRouter = require("./userRouter");
router.use("/admin", adminRouter);
router.use("/user", userRouter);

module.exports = router;