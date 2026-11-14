const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    productId : {
        ref : 'product',
        type : String
    },
    userId : {
        ref : 'user',
        type : String
    },
    rating : Number,    // 1 to 5
    comment : String
},{
    timestamps : true
})

// one review per user per product, and faster lookup of a product's reviews
reviewSchema.index({ productId : 1, userId : 1 }, { unique : true })

const reviewModel = mongoose.model("review",reviewSchema)

module.exports = reviewModel
