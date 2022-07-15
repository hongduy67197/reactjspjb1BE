const producCodeModel = require('../models/productCodeSchema')
const categoriesModel = require('../models/categoriesSchema')
const productModel = require('../models/productSchema')
function checkArray(array) {
    if (array) {
        return true;
    } else {
        return false;
    }
}

// code help [[],[]] => []
function flatten(ary) {
    var ret = [];
    for (var i = 0; i < ary.length; i++) {
        if (Array.isArray(ary[i])) {
            ret = ret.concat(flatten(ary[i]));
        } else {
            ret.push(ary[i]);
        }
    }
    return ret;
}

module.exports = { checkArray, flatten }