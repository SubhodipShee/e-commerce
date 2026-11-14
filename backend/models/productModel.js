const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName : String,
    brandName : String,
    category : String,
    productImage : [],
    description : String,
    price : Number,
    sellingPrice : Number
},{
    timestamps : true
})

// faster lookup for category pages and filters
productSchema.index({ category : 1 })

const productModel = mongoose.model("product",productSchema)

module.exports = productModel