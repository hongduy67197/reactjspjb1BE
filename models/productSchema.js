const mongoose = require('./dbConnect')

const productSchema = mongoose.Schema(
    {
        idProductCode: { type: String, ref: 'productCode' },
        price: Number,
        storage: Number,
        productPic: [{ type: String }],
        color: String,
        ram: String,
        productType: String,
        performanceProduct: String,
        cameraProduct: String,
        specialFeatures: String,
        design: String,
        panel: String,
        suggest: {
            type: String,
            enum: ['true', 'fales'],
            required: true,
            trim: true,
        }
    }, { collection: 'product' }
)

let productModel = mongoose.model('product', productSchema)

module.exports = productModel