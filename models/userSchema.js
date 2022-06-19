const mongoose = require('./dbConnect')

const userSchema = mongoose.Schema(
    {
        email: String,
        username: String,
        password: String,
        address: String,
        phone: String,
        avatar: String,
        code: String,
        token: String,
        birthDay: Date,
        role: { type: String, default: 'user' }
    }, { collection: 'users' }
)

const userModel = mongoose.model('users', userSchema)

module.exports = userModel