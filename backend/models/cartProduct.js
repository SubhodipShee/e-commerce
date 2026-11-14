const mongoose = require('mongoose')

const addToCart = mongoose.Schema({
    productId :{
        ref: 'product',
        type: String
    },
   quantity : Number,
   userId : String,
},{
    timestamps : true
})

// faster lookup of a user's cart and duplicate product check
addToCart.index({ userId : 1, productId : 1 })

const addToCartModel = mongoose.model("addToCart",addToCart)

module.exports = addToCartModel