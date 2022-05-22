const mongoose = require('./dbConnect')
const cartsSchema = mongoose.Schema(
    {
        listProduct: [
            { idProduct: { type: String, ref: 'product' }, quantity: Number, selector: Boolean }
        ],
        cartsPrice: Number,
        idUser: { type: String, ref: 'users' },
    }, { collection: 'carts' }
)

let cartsModel = mongoose.model('carts', cartsSchema)

module.exports = cartsModel