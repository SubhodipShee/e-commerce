const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
    productId : {
        ref : 'product',
        type : String
    },
    userId : String
},{
    timestamps : true
})

// one entry per product per user, and faster lookup of a user's wishlist
wishlistSchema.index({ userId : 1, productId : 1 }, { unique : true })

const wishlistModel = mongoose.model("wishlist",wishlistSchema)

module.exports = wishlistModel
