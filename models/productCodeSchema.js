const mongoose = require('./dbConnect')

const productCodeSchema = mongoose.Schema(
    {
        idCatagories: [{ type: String, ref: 'catagories' }],
        productName: String,
        thumNail: String,
        brand: String,
    }, { collection: 'productCode' }
)

let producCodeModel = mongoose.model('productCode', productCodeSchema)

module.exports = producCodeModel