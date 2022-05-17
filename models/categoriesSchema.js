const mongoose = require('./dbConnect')

const categoriesSchema = mongoose.Schema(
    {
        categoriesName: String,
        thumpNail: String,
    }, { collection: 'categories' }
)

let categoriesModel = mongoose.model('categories', categoriesSchema)

module.exports = categoriesModel