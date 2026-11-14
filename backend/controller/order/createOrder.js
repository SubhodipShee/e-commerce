const Razorpay = require('razorpay')
const addToCartModel = require("../../models/cartProduct")
const orderModel = require("../../models/orderModel")

const createOrderController = async(req,res)=>{
    try{
        const currentUser = req.userId

        const cartProduct = await addToCartModel.find({ userId : currentUser })
            .populate("productId","productName productImage sellingPrice stock")
            .lean()

        // skip cart items whose product no longer exists
        const validCartProduct = cartProduct.filter(el => el.productId)

        if(validCartProduct.length === 0){
            throw new Error("Cart is empty")
        }

        // check stock (products without stock number are not tracked)
        validCartProduct.forEach(el =>{
            const stock = el.productId.stock
            if(typeof stock === 'number' && el.quantity > stock){
                throw new Error(stock === 0
                    ? `${el.productId.productName} is out of stock`
                    : `Only ${stock} left in stock for ${el.productId.productName}`)
            }
        })

        // price is calculated from database, not from the browser
        const productDetails = validCartProduct.map(el => ({
            productId : el.productId._id,
            productName : el.productId.productName,
            productImage : el.productId.productImage[0],
            sellingPrice : el.productId.sellingPrice,
            quantity : el.quantity
        }))

        const totalAmount = productDetails.reduce((preve,curr)=> preve + (curr.sellingPrice * curr.quantity),0)

        const razorpay = new Razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPAY_KEY_SECRET
        })

        const razorpayOrder = await razorpay.orders.create({
            amount : Math.round(totalAmount * 100),   // amount in paise
            currency : "INR",
            receipt : "receipt_" + Date.now()
        })

        const newOrder = new orderModel({
            userId : currentUser,
            productDetails : productDetails,
            totalAmount : totalAmount,
            razorpayOrderId : razorpayOrder.id
        })
        const saveOrder = await newOrder.save()

        res.json({
            data : {
                orderId : saveOrder._id,
                razorpayOrderId : razorpayOrder.id,
                amount : razorpayOrder.amount,
                currency : razorpayOrder.currency,
                key : process.env.RAZORPAY_KEY_ID
            },
            message : "Order created",
            success : true,
            error : false
        })

    }catch(err){
        res.json({
            message : err?.error?.description || err?.message || err,   // razorpay sends error.description
            error : true,
            success : false
        })
    }
}

module.exports = createOrderController
