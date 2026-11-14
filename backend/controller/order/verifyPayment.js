const crypto = require('crypto')
const orderModel = require("../../models/orderModel")
const addToCartModel = require("../../models/cartProduct")
const productModel = require("../../models/productModel")

const verifyPaymentController = async(req,res)=>{
    try{
        const currentUser = req.userId
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        // razorpay signs "order_id|payment_id" with our secret key, check it matches
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex")

        if(expectedSignature !== razorpay_signature){
            throw new Error("Payment verification failed")
        }

        const updateOrder = await orderModel.findOneAndUpdate(
            // only a pending order, so the same payment can't be processed twice
            { razorpayOrderId : razorpay_order_id, userId : currentUser, paymentStatus : "PENDING" },
            { razorpayPaymentId : razorpay_payment_id, paymentStatus : "PAID" },
            { new : true }
        )

        if(!updateOrder){
            throw new Error("Order not found or already paid")
        }

        // payment done, reduce stock of ordered products (only products with stock tracked)
        await Promise.all(updateOrder.productDetails.map(product =>
            productModel.updateOne(
                { _id : product.productId, stock : { $ne : null } },
                { $inc : { stock : -product.quantity } }
            )
        ))

        // empty the user's cart
        await addToCartModel.deleteMany({ userId : currentUser })

        res.json({
            data : updateOrder,
            message : "Payment successful, order placed",
            success : true,
            error : false
        })

    }catch(err){
        res.json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = verifyPaymentController
