const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const port = 3150;
require('dotenv').config()
const Router = require("./router");
const cookie = require("cookie-parser");

app.set('view engine', 'ejs')
app.use("/views", express.static(path.join(__dirname, "./views")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookie());
app.use("/", Router);
app.listen(process.env.PORT || port, () => {
  console.log(`serve listen in localhost ${port}`);
});
