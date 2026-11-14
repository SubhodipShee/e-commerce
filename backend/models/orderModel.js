const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId : {
        ref : 'user',
        type : String
    },
    productDetails : [],    // copy of cart products at the time of order (name, image, price, quantity)
    totalAmount : Number,
    razorpayOrderId : String,
    razorpayPaymentId : String,
    paymentStatus : {
        type : String,
        default : "PENDING"   // PENDING, PAID
    },
    orderStatus : {
        type : String,
        default : "PLACED"    // PLACED, SHIPPED, DELIVERED, CANCELLED
    }
},{
    timestamps : true
})

// faster lookup of a user's orders and payment verification
orderSchema.index({ userId : 1 })
orderSchema.index({ razorpayOrderId : 1 })

const orderModel = mongoose.model("order",orderSchema)

module.exports = orderModel
