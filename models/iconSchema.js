const mongoose = require('./dbConnect')

const iconSchema = mongoose.Schema(
    {
        iconName: String,
        discount: Number,
        iconPic: String,
    }, { collection: 'icon' }
)

let iconModel = mongoose.model('icon', iconSchema)

module.exports = iconModel