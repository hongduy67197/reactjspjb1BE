const mongoose = require('./dbConnect')

const orderSchema = mongoose.Schema(
    {
        idUser: { type: String, ref: 'users' },
        address: String,
        phone: String,
        listProduct: [
            {
                idProduct: { type: String, ref: 'product', required: true },
                quantity: Number,
            }],
        status: {
            type: String,
            enum: ['pending', 'done', 'cancel'],
            required: true,
            trim: true,
        },
    }, { collection: 'orders' }
)

let ordersModel = mongoose.model('orders', orderSchema)

module.exports = ordersModel