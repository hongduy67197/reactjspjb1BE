const mongoose = require('./dbConnect')

const productSchema = mongoose.Schema(
    {
        idProductCode: { type: String, ref: 'productCode' },
        price: Number,
        priceRange: String,
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
        createDate: Date,
        suggest: {
            type: String,
            default: 'fales',
            enum: ['true', 'fales'],
            required: true,
            trim: true,
        }
    }, { collection: 'product' }
)

let productModel = mongoose.model('product', productSchema)

module.exports = productModel