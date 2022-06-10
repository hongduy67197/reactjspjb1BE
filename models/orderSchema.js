const mongoose = require('./dbConnect')

const orderSchema = mongoose.Schema(
    {
        idUser: { type: String, ref: 'users' },
        address: String,
        total: Number,
        phone: String,
        listProduct: [
            {
                idProduct: { type: String, ref: 'product', required: true },
                quantity: Number,
            }],
        status: {
            type: String,
            enum: ['pending', 'done', 'doing'],
            required: true,
            trim: true,
        },
    }, { collection: 'orders', timestamps: true }
)

let ordersModel = mongoose.model('orders', orderSchema)

module.exports = ordersModel