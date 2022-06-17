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
        rom: String,
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
        },
        icon: { type: String, ref: 'icon' },
        countSold: Number,
    }, { collection: 'product' }
)

productSchema.methods.checkStorage = async function () {
    if (this.storage < 0) {
        this.storage = 0
        this.save()
    }
}

let productModel = mongoose.model('product', productSchema)

module.exports = productModel