const mongoose = require('./dbConnect')

const sliderSchema = mongoose.Schema(
    {
        slideName: String,
        slideImg: String
    }, { collection: 'silde' }
)

let sliderModel = mongoose.model('silde', sliderSchema)

module.exports = sliderModel