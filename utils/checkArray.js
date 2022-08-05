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

const createPriceQuery = (min, max) => {
    if (min && max) return { price: { $gte: min, $lte: max } };
    if (min && !max) return { price: { $gte: min } };
    if (!min && max) return { price: { $lte: max } };
}

function filterDuplicatesInArray(array) {
    let result = array.filter((filterValue, filterIndex) => {
        let index = array.findIndex((findValue) => {
            return findValue._id.toString() === filterValue._id.toString();
        })
        return index === filterIndex
    })
    return result
}

function satisfiedProductList(listProductCode, listProduct) {
    let result = listProductCode.filter((filterValue, filterIndex) => {
        let idCode = filterValue._id.toString();
        let index = listProduct.findIndex((value) => {
            return value.idProductCode.toString() === idCode
        })
        return index > -1
    })
    return result
}

module.exports = { createPriceQuery, checkArray, flatten, satisfiedProductList, filterDuplicatesInArray }