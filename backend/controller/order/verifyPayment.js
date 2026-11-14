const crypto = require('crypto')
const orderModel = require("../../models/orderModel")
const addToCartModel = require("../../models/cartProduct")

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
            { razorpayOrderId : razorpay_order_id, userId : currentUser },
            { razorpayPaymentId : razorpay_payment_id, paymentStatus : "PAID" },
            { new : true }
        )

        if(!updateOrder){
            throw new Error("Order not found")
        }

        // payment done, empty the user's cart
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
