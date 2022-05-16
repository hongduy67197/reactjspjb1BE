const mongoose = require('./dbConnect')

const userSchema = mongoose.Schema(
    {
        email: String,
        username: String,
        password: String,
        address: String,
        phone: String,
        avatar: String,
        role: { type: String, default: 'user' }
    }, { collection: 'users' }
)

const userModel = mongoose.model('user', userSchema)

module.exports = userModel