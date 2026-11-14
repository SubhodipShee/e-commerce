const orderModel = require("../../models/orderModel")

const orderListController = async(req,res)=>{
    try{
        const currentUser = req.userId

        // only paid orders of the logged-in user, newest first
        const orderList = await orderModel.find({ userId : currentUser, paymentStatus : "PAID" })
            .sort({ createdAt : -1 })
            .lean()

        res.json({
            data : orderList,
            message : "Order list",
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

module.exports = orderListController
