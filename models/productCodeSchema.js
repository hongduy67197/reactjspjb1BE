const mongoose = require('./dbConnect')

const productCodeSchema = mongoose.Schema(
    {
        idCategories: [{ type: String, ref: 'categories' }],
        productName: String,
        thumNail: String,
        productType: String,
        performanceProduct: String,
        cameraProduct: String,
        specialFeatures: String,
        design: String,
        panel: String,
    }, { collection: 'productCode' }
)

let producCodeModel = mongoose.model('productCode', productCodeSchema)

module.exports = producCodeModel