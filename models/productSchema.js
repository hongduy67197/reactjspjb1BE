const mongoose = require('./dbConnect')

const productSchema = mongoose.Schema(
    {
        idProductCode: { type: String, ref: 'productCode' },
        price: Number,
        storage: Number,
        thumNail: String,
        color: String,
        ram: String,
        rom: String,
    }, { collection: 'product' }
)

let productModel = mongoose.model('product', productSchema)

module.exports = productModel