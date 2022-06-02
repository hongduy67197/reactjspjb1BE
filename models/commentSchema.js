const mongoose = require('./dbConnect')
const commentSchema = mongoose.Schema(
    {
        idUser: { type: String, ref: 'users' },
        idProductCode: { type: String, ref: 'productCode' },
        commentContent: String,
        commentImg: String,
    }, { collection: 'comment', timestamps: true }
)

let commentModel = mongoose.model('comment', commentSchema)

module.exports = commentModel